package com.google.android.gcm;

import android.app.AlarmManager;
import android.app.IntentService;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.os.PowerManager.WakeLock;
import android.os.SystemClock;
import android.util.Log;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public abstract class GCMBaseIntentService extends IntentService {
    private static final String EXTRA_TOKEN = "token";
    private static final Object LOCK;
    private static final int MAX_BACKOFF_MS;
    public static final String TAG = "GCMBaseIntentService";
    private static final String TOKEN;
    private static final String WAKELOCK_KEY = "GCM_LIB";
    private static int sCounter;
    private static final Random sRandom;
    private static WakeLock sWakeLock;
    private final String[] mSenderIds;

    protected abstract void onError(Context context, String str);

    protected abstract void onMessage(Context context, Intent intent);

    protected abstract void onRegistered(Context context, String str);

    protected abstract void onUnregistered(Context context, String str);

    static {
        LOCK = GCMBaseIntentService.class;
        sCounter = MAX_BACKOFF_MS;
        sRandom = new Random();
        MAX_BACKOFF_MS = (int) TimeUnit.SECONDS.toMillis(3600);
        TOKEN = Long.toBinaryString(sRandom.nextLong());
    }

    protected GCMBaseIntentService() {
        this(getName("DynamicSenderIds"), null);
    }

    protected GCMBaseIntentService(String... senderIds) {
        this(getName(senderIds), senderIds);
    }

    private GCMBaseIntentService(String name, String[] senderIds) {
        super(name);
        this.mSenderIds = senderIds;
    }

    private static String getName(String senderId) {
        StringBuilder append = new StringBuilder().append("GCMIntentService-").append(senderId).append("-");
        int i = sCounter + 1;
        sCounter = i;
        String name = append.append(i).toString();
        Log.v(TAG, "Intent service name: " + name);
        return name;
    }

    private static String getName(String[] senderIds) {
        return getName(GCMRegistrar.getFlatSenderIds(senderIds));
    }

    protected String[] getSenderIds(Context context) {
        if (this.mSenderIds != null) {
            return this.mSenderIds;
        }
        throw new IllegalStateException("sender id not set on constructor");
    }

    protected void onDeletedMessages(Context context, int total) {
    }

    protected boolean onRecoverableError(Context context, String errorId) {
        return true;
    }

    public final void onHandleIntent(Intent intent) {
        String sTotal;
        try {
            Context context = getApplicationContext();
            String action = intent.getAction();
            if (action.equals(GCMConstants.INTENT_FROM_GCM_REGISTRATION_CALLBACK)) {
                GCMRegistrar.setRetryBroadcastReceiver(context);
                handleRegistration(context, intent);
            } else if (action.equals(GCMConstants.INTENT_FROM_GCM_MESSAGE)) {
                String messageType = intent.getStringExtra(GCMConstants.EXTRA_SPECIAL_MESSAGE);
                if (messageType == null) {
                    onMessage(context, intent);
                } else if (messageType.equals(GCMConstants.VALUE_DELETED_MESSAGES)) {
                    sTotal = intent.getStringExtra(GCMConstants.EXTRA_TOTAL_DELETED);
                    if (sTotal != null) {
                        int total = Integer.parseInt(sTotal);
                        Log.v(TAG, "Received deleted messages notification: " + total);
                        onDeletedMessages(context, total);
                    }
                } else {
                    Log.e(TAG, "Received unknown special message: " + messageType);
                }
            } else if (action.equals(GCMConstants.INTENT_FROM_GCM_LIBRARY_RETRY)) {
                String token = intent.getStringExtra(EXTRA_TOKEN);
                if (!TOKEN.equals(token)) {
                    Log.e(TAG, "Received invalid token: " + token);
                    synchronized (LOCK) {
                        if (sWakeLock != null) {
                            Log.v(TAG, "Releasing wakelock");
                            sWakeLock.release();
                        } else {
                            Log.e(TAG, "Wakelock reference is null");
                        }
                    }
                    return;
                } else if (GCMRegistrar.isRegistered(context)) {
                    GCMRegistrar.internalUnregister(context);
                } else {
                    GCMRegistrar.internalRegister(context, getSenderIds(context));
                }
            }
        } catch (NumberFormatException e) {
            Log.e(TAG, "GCM returned invalid number of deleted messages: " + sTotal);
        } catch (Throwable th) {
            synchronized (LOCK) {
            }
            if (sWakeLock != null) {
                Log.v(TAG, "Releasing wakelock");
                sWakeLock.release();
            } else {
                Log.e(TAG, "Wakelock reference is null");
            }
        }
        synchronized (LOCK) {
            if (sWakeLock != null) {
                Log.v(TAG, "Releasing wakelock");
                sWakeLock.release();
            } else {
                Log.e(TAG, "Wakelock reference is null");
            }
        }
    }

    static void runIntentInService(Context context, Intent intent, String className) {
        synchronized (LOCK) {
            if (sWakeLock == null) {
                sWakeLock = ((PowerManager) context.getSystemService("power")).newWakeLock(1, WAKELOCK_KEY);
            }
        }
        Log.v(TAG, "Acquiring wakelock");
        sWakeLock.acquire();
        intent.setClassName(context, className);
        context.startService(intent);
    }

    private void handleRegistration(Context context, Intent intent) {
        String registrationId = intent.getStringExtra(GCMConstants.EXTRA_REGISTRATION_ID);
        String error = intent.getStringExtra(GCMConstants.EXTRA_ERROR);
        String unregistered = intent.getStringExtra(GCMConstants.EXTRA_UNREGISTERED);
        Log.d(TAG, "handleRegistration: registrationId = " + registrationId + ", error = " + error + ", unregistered = " + unregistered);
        if (registrationId != null) {
            GCMRegistrar.resetBackoff(context);
            GCMRegistrar.setRegistrationId(context, registrationId);
            onRegistered(context, registrationId);
        } else if (unregistered != null) {
            GCMRegistrar.resetBackoff(context);
            onUnregistered(context, GCMRegistrar.clearRegistrationId(context));
        } else {
            Log.d(TAG, "Registration error: " + error);
            if (!GCMConstants.ERROR_SERVICE_NOT_AVAILABLE.equals(error)) {
                onError(context, error);
            } else if (onRecoverableError(context, error)) {
                int backoffTimeMs = GCMRegistrar.getBackoff(context);
                int nextAttempt = (backoffTimeMs / 2) + sRandom.nextInt(backoffTimeMs);
                Log.d(TAG, "Scheduling registration retry, backoff = " + nextAttempt + " (" + backoffTimeMs + ")");
                Intent retryIntent = new Intent(GCMConstants.INTENT_FROM_GCM_LIBRARY_RETRY);
                retryIntent.putExtra(EXTRA_TOKEN, TOKEN);
                ((AlarmManager) context.getSystemService("alarm")).set(3, SystemClock.elapsedRealtime() + ((long) nextAttempt), PendingIntent.getBroadcast(context, MAX_BACKOFF_MS, retryIntent, MAX_BACKOFF_MS));
                if (backoffTimeMs < MAX_BACKOFF_MS) {
                    GCMRegistrar.setBackoff(context, backoffTimeMs * 2);
                }
            } else {
                Log.d(TAG, "Not retrying failed operation");
            }
        }
    }
}
