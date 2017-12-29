package com.plugin.gcm;

import android.content.Context;
import com.google.android.gcm.GCMBroadcastReceiver;

public class CordovaGCMBroadcastReceiver extends GCMBroadcastReceiver {
    protected String getGCMIntentServiceClassName(Context context) {
        return "com.plugin.gcm.GCMIntentService";
    }
}
