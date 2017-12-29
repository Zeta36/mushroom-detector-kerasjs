package com.plugin.gcm;

import android.app.Activity;
import android.app.NotificationManager;
import android.os.Bundle;
import android.util.Log;

public class PushHandlerActivity extends Activity {
    private static String TAG;

    static {
        TAG = "PushHandlerActivity";
    }

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.v(TAG, "onCreate");
        boolean isPushPluginActive = PushPlugin.isActive();
        processPushBundle(isPushPluginActive);
        finish();
        if (!isPushPluginActive) {
            forceMainActivityReload();
        }
    }

    private void processPushBundle(boolean isPushPluginActive) {
        boolean z = false;
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            Bundle originalExtras = extras.getBundle("pushBundle");
            originalExtras.putBoolean("foreground", false);
            String str = "coldstart";
            if (!isPushPluginActive) {
                z = true;
            }
            originalExtras.putBoolean(str, z);
            PushPlugin.sendExtras(originalExtras);
        }
    }

    private void forceMainActivityReload() {
        startActivity(getPackageManager().getLaunchIntentForPackage(getApplicationContext().getPackageName()));
    }

    protected void onResume() {
        super.onResume();
        ((NotificationManager) getSystemService("notification")).cancelAll();
    }
}
