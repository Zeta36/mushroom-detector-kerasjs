package com.ionic.keyboard;

import android.graphics.Rect;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewTreeObserver.OnGlobalLayoutListener;
import android.view.inputmethod.InputMethodManager;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

public class IonicKeyboard extends CordovaPlugin {

    /* renamed from: com.ionic.keyboard.IonicKeyboard.1 */
    class C00561 implements OnGlobalLayoutListener {
        int previousHeightDiff;
        final /* synthetic */ CordovaWebView val$appView;
        final /* synthetic */ float val$density;
        final /* synthetic */ View val$rootView;

        C00561(View view, float f, CordovaWebView cordovaWebView) {
            this.val$rootView = view;
            this.val$density = f;
            this.val$appView = cordovaWebView;
            this.previousHeightDiff = 0;
        }

        public void onGlobalLayout() {
            Rect r = new Rect();
            this.val$rootView.getWindowVisibleDisplayFrame(r);
            int pixelHeightDiff = (int) (((float) (this.val$rootView.getRootView().getHeight() - (r.bottom - r.top))) / this.val$density);
            if (pixelHeightDiff > 100 && pixelHeightDiff != this.previousHeightDiff) {
                this.val$appView.sendJavascript("cordova.plugins.Keyboard.isVisible = true");
                this.val$appView.sendJavascript("cordova.fireWindowEvent('native.keyboardshow', { 'keyboardHeight':" + Integer.toString(pixelHeightDiff) + "});");
                this.val$appView.sendJavascript("cordova.fireWindowEvent('native.showkeyboard', { 'keyboardHeight':" + Integer.toString(pixelHeightDiff) + "});");
            } else if (pixelHeightDiff != this.previousHeightDiff && this.previousHeightDiff - pixelHeightDiff > 100) {
                this.val$appView.sendJavascript("cordova.plugins.Keyboard.isVisible = false");
                this.val$appView.sendJavascript("cordova.fireWindowEvent('native.keyboardhide')");
                this.val$appView.sendJavascript("cordova.fireWindowEvent('native.hidekeyboard')");
            }
            this.previousHeightDiff = pixelHeightDiff;
        }
    }

    /* renamed from: com.ionic.keyboard.IonicKeyboard.2 */
    class C00572 implements Runnable {
        final /* synthetic */ CallbackContext val$callbackContext;

        C00572(CallbackContext callbackContext) {
            this.val$callbackContext = callbackContext;
        }

        public void run() {
            InputMethodManager inputManager = (InputMethodManager) IonicKeyboard.this.cordova.getActivity().getSystemService("input_method");
            View v = IonicKeyboard.this.cordova.getActivity().getCurrentFocus();
            if (v == null) {
                this.val$callbackContext.error("No current focus");
                return;
            }
            inputManager.hideSoftInputFromWindow(v.getWindowToken(), 2);
            this.val$callbackContext.success();
        }
    }

    /* renamed from: com.ionic.keyboard.IonicKeyboard.3 */
    class C00583 implements Runnable {
        final /* synthetic */ CallbackContext val$callbackContext;

        C00583(CallbackContext callbackContext) {
            this.val$callbackContext = callbackContext;
        }

        public void run() {
            ((InputMethodManager) IonicKeyboard.this.cordova.getActivity().getSystemService("input_method")).toggleSoftInput(0, 1);
            this.val$callbackContext.success();
        }
    }

    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        DisplayMetrics dm = new DisplayMetrics();
        cordova.getActivity().getWindowManager().getDefaultDisplay().getMetrics(dm);
        float density = dm.density;
        CordovaWebView appView = webView;
        View rootView = cordova.getActivity().getWindow().getDecorView().findViewById(16908290).getRootView();
        rootView.getViewTreeObserver().addOnGlobalLayoutListener(new C00561(rootView, density, appView));
    }

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("close".equals(action)) {
            this.cordova.getThreadPool().execute(new C00572(callbackContext));
            return true;
        } else if (!"show".equals(action)) {
            return false;
        } else {
            this.cordova.getThreadPool().execute(new C00583(callbackContext));
            return true;
        }
    }
}
