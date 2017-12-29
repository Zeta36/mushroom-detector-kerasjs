package com.plugin.gcm;

import android.app.NotificationManager;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import com.google.android.gcm.GCMRegistrar;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class PushPlugin extends CordovaPlugin {
    public static final String EXIT = "exit";
    public static final String REGISTER = "register";
    public static final String TAG = "PushPlugin";
    public static final String UNREGISTER = "unregister";
    private static Bundle gCachedExtras;
    private static String gECB;
    private static boolean gForeground;
    private static String gSenderID;
    private static CordovaWebView gWebView;

    static {
        gCachedExtras = null;
        gForeground = false;
    }

    private Context getApplicationContext() {
        return this.cordova.getActivity().getApplicationContext();
    }

    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) {
        Log.v(TAG, "execute: action=" + action);
        if (REGISTER.equals(action)) {
            boolean result;
            Log.v(TAG, "execute: data=" + data.toString());
            try {
                JSONObject jo = data.getJSONObject(0);
                gWebView = this.webView;
                Log.v(TAG, "execute: jo=" + jo.toString());
                gECB = (String) jo.get("ecb");
                gSenderID = (String) jo.get("senderID");
                Log.v(TAG, "execute: ECB=" + gECB + " senderID=" + gSenderID);
                GCMRegistrar.register(getApplicationContext(), gSenderID);
                result = true;
                callbackContext.success();
            } catch (JSONException e) {
                Log.e(TAG, "execute: Got JSON Exception " + e.getMessage());
                result = false;
                callbackContext.error(e.getMessage());
            }
            if (gCachedExtras == null) {
                return result;
            }
            Log.v(TAG, "sending cached extras");
            sendExtras(gCachedExtras);
            gCachedExtras = null;
            return result;
        } else if (UNREGISTER.equals(action)) {
            GCMRegistrar.unregister(getApplicationContext());
            Log.v(TAG, "UNREGISTER");
            callbackContext.success();
            return true;
        } else {
            Log.e(TAG, "Invalid action : " + action);
            callbackContext.error("Invalid action : " + action);
            return false;
        }
    }

    public static void sendJavascript(JSONObject _json) {
        String _d = "javascript:" + gECB + "(" + _json.toString() + ")";
        Log.v(TAG, "sendJavascript: " + _d);
        if (gECB != null && gWebView != null) {
            gWebView.sendJavascript(_d);
        }
    }

    public static void sendExtras(Bundle extras) {
        if (extras == null) {
            return;
        }
        if (gECB == null || gWebView == null) {
            Log.v(TAG, "sendExtras: caching extras to send at a later time.");
            gCachedExtras = extras;
            return;
        }
        sendJavascript(convertBundleToJson(extras));
    }

    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        gForeground = true;
    }

    public void onPause(boolean multitasking) {
        super.onPause(multitasking);
        gForeground = false;
        ((NotificationManager) this.cordova.getActivity().getSystemService("notification")).cancelAll();
    }

    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
        gForeground = true;
    }

    public void onDestroy() {
        super.onDestroy();
        gForeground = false;
        gECB = null;
        gWebView = null;
    }

    private static JSONObject convertBundleToJson(Bundle extras) {
        try {
            JSONObject json = new JSONObject().put("event", "message");
            JSONObject jsondata = new JSONObject();
            for (String key : extras.keySet()) {
                Object value = extras.get(key);
                if (key.equals("from") || key.equals("collapse_key")) {
                    json.put(key, value);
                } else if (key.equals("foreground")) {
                    json.put(key, extras.getBoolean("foreground"));
                } else if (key.equals("coldstart")) {
                    json.put(key, extras.getBoolean("coldstart"));
                } else {
                    if (key.equals("message") || key.equals("msgcnt") || key.equals("soundname")) {
                        json.put(key, value);
                    }
                    if (value instanceof String) {
                        String strValue = (String) value;
                        if (strValue.startsWith("{")) {
                            try {
                                jsondata.put(key, new JSONObject(strValue));
                            } catch (Exception e) {
                                jsondata.put(key, value);
                            }
                        } else if (strValue.startsWith("[")) {
                            try {
                                jsondata.put(key, new JSONArray(strValue));
                            } catch (Exception e2) {
                                jsondata.put(key, value);
                            }
                        } else {
                            jsondata.put(key, value);
                        }
                    } else {
                        continue;
                    }
                }
            }
            json.put("payload", jsondata);
            Log.v(TAG, "extrasToJSON: " + json.toString());
            return json;
        } catch (JSONException e3) {
            Log.e(TAG, "extrasToJSON: JSON exception");
            return null;
        }
    }

    public static boolean isInForeground() {
        return gForeground;
    }

    public static boolean isActive() {
        return gWebView != null;
    }
}
