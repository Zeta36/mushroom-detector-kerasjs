package com.plugin.gcm;

import android.annotation.SuppressLint;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat.Builder;
import android.util.Log;
import com.google.android.gcm.GCMBaseIntentService;
import org.json.JSONException;
import org.json.JSONObject;

@SuppressLint({"NewApi"})
public class GCMIntentService extends GCMBaseIntentService {
    private static final String TAG = "GCMIntentService";

    public GCMIntentService() {
        super(TAG);
    }

    public void onRegistered(Context context, String regId) {
        Log.v(TAG, "onRegistered: " + regId);
        try {
            JSONObject json = new JSONObject().put("event", "registered");
            json.put("regid", regId);
            Log.v(TAG, "onRegistered: " + json.toString());
            PushPlugin.sendJavascript(json);
        } catch (JSONException e) {
            Log.e(TAG, "onRegistered: JSON exception");
        }
    }

    public void onUnregistered(Context context, String regId) {
        Log.d(TAG, "onUnregistered - regId: " + regId);
    }

    protected void onMessage(Context context, Intent intent) {
        Log.d(TAG, "onMessage - context: " + context);
        Bundle extras = intent.getExtras();
        if (extras == null) {
            return;
        }
        if (PushPlugin.isInForeground()) {
            extras.putBoolean("foreground", true);
            PushPlugin.sendExtras(extras);
            return;
        }
        extras.putBoolean("foreground", false);
        if (extras.getString("message") != null && extras.getString("message").length() != 0) {
            createNotification(context, extras);
        }
    }

    public void createNotification(Context context, Bundle extras) {
        NotificationManager mNotificationManager = (NotificationManager) getSystemService("notification");
        String appName = getAppName(this);
        Intent notificationIntent = new Intent(this, PushHandlerActivity.class);
        notificationIntent.addFlags(603979776);
        notificationIntent.putExtra("pushBundle", extras);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, 134217728);
        int defaults = -1;
        if (extras.getString("defaults") != null) {
            try {
                defaults = Integer.parseInt(extras.getString("defaults"));
            } catch (NumberFormatException e) {
            }
        }
        Builder mBuilder = new Builder(context).setDefaults(defaults).setSmallIcon(context.getApplicationInfo().icon).setWhen(System.currentTimeMillis()).setContentTitle(extras.getString("title")).setTicker(extras.getString("title")).setContentIntent(contentIntent).setAutoCancel(true);
        String message = extras.getString("message");
        if (message != null) {
            mBuilder.setContentText(message);
        } else {
            mBuilder.setContentText("<missing message content>");
        }
        String msgcnt = extras.getString("msgcnt");
        if (msgcnt != null) {
            mBuilder.setNumber(Integer.parseInt(msgcnt));
        }
        int notId = 0;
        try {
            notId = Integer.parseInt(extras.getString("notId"));
        } catch (NumberFormatException e2) {
            Log.e(TAG, "Number format exception - Error parsing Notification ID: " + e2.getMessage());
        } catch (Exception e3) {
            Log.e(TAG, "Number format exception - Error parsing Notification ID" + e3.getMessage());
        }
        mNotificationManager.notify(appName, notId, mBuilder.build());
    }

    private static String getAppName(Context context) {
        return (String) context.getPackageManager().getApplicationLabel(context.getApplicationInfo());
    }

    public void onError(Context context, String errorId) {
        Log.e(TAG, "onError - errorId: " + errorId);
    }
}
