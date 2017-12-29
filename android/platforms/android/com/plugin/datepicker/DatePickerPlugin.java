package com.plugin.datepicker;

import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.app.DatePickerDialog.OnDateSetListener;
import android.app.TimePickerDialog;
import android.app.TimePickerDialog.OnTimeSetListener;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.os.Build.VERSION;
import android.util.Log;
import android.widget.DatePicker;
import android.widget.DatePicker.OnDateChangedListener;
import android.widget.TimePicker;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Random;
import java.util.TimeZone;
import org.apache.cordova.BuildConfig;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@SuppressLint({"NewApi"})
public class DatePickerPlugin extends CordovaPlugin {
    private static final String ACTION_DATE = "date";
    private static final String ACTION_TIME = "time";
    private static final String RESULT_CANCEL = "cancel";
    private static final String RESULT_ERROR = "error";
    private boolean called;
    private boolean canceled;
    private final String pluginName;
    private TimePicker timePicker;
    private int timePickerHour;
    private int timePickerMinute;

    /* renamed from: com.plugin.datepicker.DatePickerPlugin.1 */
    class C00641 implements Runnable {
        final /* synthetic */ Calendar val$calendarDate;
        final /* synthetic */ CallbackContext val$callbackContext;
        final /* synthetic */ Context val$currentCtx;
        final /* synthetic */ DatePickerPlugin val$datePickerPlugin;
        final /* synthetic */ JsonDate val$jsonDate;

        /* renamed from: com.plugin.datepicker.DatePickerPlugin.1.1 */
        class C00601 extends TimePickerDialog {
            C00601(Context x0, OnTimeSetListener x1, int x2, int x3, boolean x4) {
                super(x0, x1, x2, x3, x4);
            }

            public void onTimeChanged(TimePicker view, int hourOfDay, int minute) {
                DatePickerPlugin.this.timePicker = view;
                DatePickerPlugin.this.timePickerHour = hourOfDay;
                DatePickerPlugin.this.timePickerMinute = minute;
            }
        }

        /* renamed from: com.plugin.datepicker.DatePickerPlugin.1.2 */
        class C00612 implements OnClickListener {
            final /* synthetic */ TimeSetListener val$timeSetListener;

            C00612(TimeSetListener timeSetListener) {
                this.val$timeSetListener = timeSetListener;
            }

            public void onClick(DialogInterface dialog, int which) {
                if (DatePickerPlugin.this.timePicker != null) {
                    Calendar now = Calendar.getInstance();
                    this.val$timeSetListener.onTimeSet(DatePickerPlugin.this.timePicker, now.get(11), now.get(12));
                }
            }
        }

        /* renamed from: com.plugin.datepicker.DatePickerPlugin.1.3 */
        class C00623 implements OnClickListener {
            C00623() {
            }

            public void onClick(DialogInterface dialog, int which) {
                DatePickerPlugin.this.canceled = true;
                C00641.this.val$callbackContext.error(DatePickerPlugin.RESULT_CANCEL);
            }
        }

        /* renamed from: com.plugin.datepicker.DatePickerPlugin.1.4 */
        class C00634 implements OnClickListener {
            final /* synthetic */ TimeSetListener val$timeSetListener;

            C00634(TimeSetListener timeSetListener) {
                this.val$timeSetListener = timeSetListener;
            }

            public void onClick(DialogInterface dialog, int which) {
                if (DatePickerPlugin.this.timePicker != null) {
                    Calendar now = Calendar.getInstance();
                    this.val$timeSetListener.onTimeSet(DatePickerPlugin.this.timePicker, DatePickerPlugin.this.timePickerHour, DatePickerPlugin.this.timePickerMinute);
                }
            }
        }

        C00641(DatePickerPlugin datePickerPlugin, CallbackContext callbackContext, Calendar calendar, Context context, JsonDate jsonDate) {
            this.val$datePickerPlugin = datePickerPlugin;
            this.val$callbackContext = callbackContext;
            this.val$calendarDate = calendar;
            this.val$currentCtx = context;
            this.val$jsonDate = jsonDate;
        }

        public void run() {
            TimeSetListener timeSetListener = new TimeSetListener(this.val$datePickerPlugin, this.val$callbackContext, this.val$calendarDate, null);
            TimePickerDialog timeDialog = new C00601(this.val$currentCtx, timeSetListener, this.val$jsonDate.hour, this.val$jsonDate.minutes, this.val$jsonDate.is24Hour);
            if (VERSION.SDK_INT >= 11) {
                timeDialog.setCancelable(true);
                timeDialog.setCanceledOnTouchOutside(false);
                if (!this.val$jsonDate.nowText.isEmpty()) {
                    timeDialog.setButton(-3, this.val$jsonDate.nowText, new C00612(timeSetListener));
                }
                timeDialog.setButton(-2, this.val$jsonDate.cancelText.isEmpty() ? this.val$currentCtx.getString(17039360) : this.val$jsonDate.cancelText, new C00623());
                timeDialog.setButton(-1, this.val$jsonDate.okText.isEmpty() ? this.val$currentCtx.getString(17039370) : this.val$jsonDate.okText, new C00634(timeSetListener));
            }
            timeDialog.show();
            timeDialog.updateTime(new Random().nextInt(23), new Random().nextInt(59));
            timeDialog.updateTime(this.val$jsonDate.hour, this.val$jsonDate.minutes);
        }
    }

    /* renamed from: com.plugin.datepicker.DatePickerPlugin.2 */
    class C00652 implements Runnable {
        final /* synthetic */ CallbackContext val$callbackContext;
        final /* synthetic */ Context val$currentCtx;
        final /* synthetic */ DatePickerPlugin val$datePickerPlugin;
        final /* synthetic */ JsonDate val$jsonDate;

        C00652(DatePickerPlugin datePickerPlugin, CallbackContext callbackContext, JsonDate jsonDate, Context context) {
            this.val$datePickerPlugin = datePickerPlugin;
            this.val$callbackContext = callbackContext;
            this.val$jsonDate = jsonDate;
            this.val$currentCtx = context;
        }

        public void run() {
            DateSetListener dateSetListener = new DateSetListener(this.val$datePickerPlugin, this.val$callbackContext, this.val$jsonDate, null);
            DatePickerDialog dateDialog = new DatePickerDialog(this.val$currentCtx, dateSetListener, this.val$jsonDate.year, this.val$jsonDate.month, this.val$jsonDate.day);
            if (VERSION.SDK_INT >= 11) {
                DatePickerPlugin.this.prepareDialog(dateDialog, dateSetListener, this.val$callbackContext, this.val$currentCtx, this.val$jsonDate);
            } else {
                DatePickerPlugin.this.prepareDialogPreHoneycomb(dateDialog, this.val$callbackContext, this.val$currentCtx, this.val$jsonDate);
            }
            dateDialog.show();
        }
    }

    /* renamed from: com.plugin.datepicker.DatePickerPlugin.3 */
    class C00663 implements OnClickListener {
        final /* synthetic */ DatePickerDialog val$dateDialog;
        final /* synthetic */ OnDateSetListener val$dateListener;

        C00663(DatePickerDialog datePickerDialog, OnDateSetListener onDateSetListener) {
            this.val$dateDialog = datePickerDialog;
            this.val$dateListener = onDateSetListener;
        }

        public void onClick(DialogInterface dialog, int which) {
            Calendar now = Calendar.getInstance();
            this.val$dateListener.onDateSet(this.val$dateDialog.getDatePicker(), now.get(1), now.get(2), now.get(5));
        }
    }

    /* renamed from: com.plugin.datepicker.DatePickerPlugin.4 */
    class C00674 implements OnClickListener {
        final /* synthetic */ CallbackContext val$callbackContext;

        C00674(CallbackContext callbackContext) {
            this.val$callbackContext = callbackContext;
        }

        public void onClick(DialogInterface dialog, int which) {
            DatePickerPlugin.this.canceled = true;
            this.val$callbackContext.error(DatePickerPlugin.RESULT_CANCEL);
        }
    }

    /* renamed from: com.plugin.datepicker.DatePickerPlugin.5 */
    class C00685 implements OnClickListener {
        final /* synthetic */ DatePickerDialog val$dateDialog;
        final /* synthetic */ OnDateSetListener val$dateListener;

        C00685(DatePickerDialog datePickerDialog, OnDateSetListener onDateSetListener) {
            this.val$dateDialog = datePickerDialog;
            this.val$dateListener = onDateSetListener;
        }

        public void onClick(DialogInterface dialog, int which) {
            DatePicker datePicker = this.val$dateDialog.getDatePicker();
            this.val$dateListener.onDateSet(datePicker, datePicker.getYear(), datePicker.getMonth(), datePicker.getDayOfMonth());
        }
    }

    /* renamed from: com.plugin.datepicker.DatePickerPlugin.6 */
    class C00696 implements OnDateChangedListener {
        final /* synthetic */ JsonDate val$jsonDate;
        final /* synthetic */ int val$maxDay;
        final /* synthetic */ int val$maxMonth;
        final /* synthetic */ int val$maxYear;
        final /* synthetic */ int val$minDay;
        final /* synthetic */ int val$minMonth;
        final /* synthetic */ int val$minYear;

        C00696(JsonDate jsonDate, int i, int i2, int i3, int i4, int i5, int i6) {
            this.val$jsonDate = jsonDate;
            this.val$maxYear = i;
            this.val$maxMonth = i2;
            this.val$maxDay = i3;
            this.val$minYear = i4;
            this.val$minMonth = i5;
            this.val$minDay = i6;
        }

        public void onDateChanged(DatePicker view, int year, int month, int day) {
            if (this.val$jsonDate.maxDate > 0 && this.val$jsonDate.maxDate > this.val$jsonDate.minDate && (year > this.val$maxYear || ((month > this.val$maxMonth && year == this.val$maxYear) || (day > this.val$maxDay && year == this.val$maxYear && month == this.val$maxMonth)))) {
                view.updateDate(this.val$maxYear, this.val$maxMonth, this.val$maxDay);
            }
            if (this.val$jsonDate.minDate <= 0) {
                return;
            }
            if (year < this.val$minYear || ((month < this.val$minMonth && year == this.val$minYear) || (day < this.val$minDay && year == this.val$minYear && month == this.val$minMonth))) {
                view.updateDate(this.val$minYear, this.val$minMonth, this.val$minDay);
            }
        }
    }

    private final class DateSetListener implements OnDateSetListener {
        private final CallbackContext callbackContext;
        private final DatePickerPlugin datePickerPlugin;
        private JsonDate jsonDate;

        private DateSetListener(DatePickerPlugin datePickerPlugin, CallbackContext callbackContext, JsonDate jsonDate) {
            this.datePickerPlugin = datePickerPlugin;
            this.callbackContext = callbackContext;
            this.jsonDate = jsonDate;
        }

        public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
            if (!DatePickerPlugin.this.canceled && !DatePickerPlugin.this.called) {
                DatePickerPlugin.this.called = true;
                DatePickerPlugin.this.canceled = false;
                Log.d("onDateSet", "called: " + DatePickerPlugin.this.called);
                Log.d("onDateSet", "canceled: " + DatePickerPlugin.this.canceled);
                Log.d("onDateSet", "mode: " + this.jsonDate.action);
                if (DatePickerPlugin.ACTION_DATE.equalsIgnoreCase(this.jsonDate.action)) {
                    String returnDate = year + "/" + (monthOfYear + 1) + "/" + dayOfMonth;
                    Log.d("onDateSet", "returnDate: " + returnDate);
                    this.callbackContext.success(returnDate);
                    return;
                }
                Calendar selectedDate = Calendar.getInstance();
                selectedDate.set(1, year);
                selectedDate.set(2, monthOfYear);
                selectedDate.set(5, dayOfMonth);
                DatePickerPlugin.this.cordova.getActivity().runOnUiThread(DatePickerPlugin.this.runnableTimeDialog(this.datePickerPlugin, DatePickerPlugin.this.cordova.getActivity(), this.callbackContext, this.jsonDate, selectedDate));
            }
        }
    }

    private final class JsonDate {
        private String action;
        private String cancelText;
        private int day;
        private int hour;
        private boolean is24Hour;
        private long maxDate;
        private long minDate;
        private int minutes;
        private int month;
        private String nowText;
        private String okText;
        private String todayText;
        private int year;

        public JsonDate() {
            this.action = DatePickerPlugin.ACTION_DATE;
            this.okText = BuildConfig.VERSION_NAME;
            this.cancelText = BuildConfig.VERSION_NAME;
            this.todayText = BuildConfig.VERSION_NAME;
            this.nowText = BuildConfig.VERSION_NAME;
            this.minDate = 0;
            this.maxDate = 0;
            this.month = 0;
            this.day = 0;
            this.year = 0;
            this.hour = 0;
            this.minutes = 0;
            this.is24Hour = false;
            reset(Calendar.getInstance());
        }

        private void reset(Calendar c) {
            this.year = c.get(1);
            this.month = c.get(2);
            this.day = c.get(5);
            this.hour = c.get(11);
            this.minutes = c.get(12);
        }

        public JsonDate fromJson(JSONArray data) {
            long j = 0;
            boolean z = false;
            try {
                long j2;
                JSONObject obj = data.getJSONObject(0);
                this.action = isNotEmpty(obj, "mode") ? obj.getString("mode") : DatePickerPlugin.ACTION_DATE;
                if (isNotEmpty(obj, "minDate")) {
                    j2 = obj.getLong("minDate");
                } else {
                    j2 = 0;
                }
                this.minDate = j2;
                if (isNotEmpty(obj, "maxDate")) {
                    j = obj.getLong("maxDate");
                }
                this.maxDate = j;
                this.okText = isNotEmpty(obj, "okText") ? obj.getString("okText") : BuildConfig.VERSION_NAME;
                this.cancelText = isNotEmpty(obj, "cancelText") ? obj.getString("cancelText") : BuildConfig.VERSION_NAME;
                this.todayText = isNotEmpty(obj, "todayText") ? obj.getString("todayText") : BuildConfig.VERSION_NAME;
                this.nowText = isNotEmpty(obj, "nowText") ? obj.getString("nowText") : BuildConfig.VERSION_NAME;
                if (isNotEmpty(obj, "is24Hour")) {
                    z = obj.getBoolean("is24Hour");
                }
                this.is24Hour = z;
                String[] datePart = obj.getString(DatePickerPlugin.ACTION_DATE).split("/");
                this.month = Integer.parseInt(datePart[0]) - 1;
                this.day = Integer.parseInt(datePart[1]);
                this.year = Integer.parseInt(datePart[2]);
                this.hour = Integer.parseInt(datePart[3]);
                this.minutes = Integer.parseInt(datePart[4]);
            } catch (JSONException e) {
                reset(Calendar.getInstance());
            }
            return this;
        }

        public boolean isNotEmpty(JSONObject object, String key) throws JSONException {
            return object.has(key) && !object.isNull(key) && object.get(key).toString().length() > 0 && !JSONObject.NULL.toString().equals(object.get(key).toString());
        }
    }

    private final class TimeSetListener implements OnTimeSetListener {
        private Calendar calendarDate;
        private final CallbackContext callbackContext;

        private TimeSetListener(DatePickerPlugin datePickerPlugin, CallbackContext callbackContext, Calendar selectedDate) {
            this.callbackContext = callbackContext;
            if (selectedDate == null) {
                selectedDate = Calendar.getInstance();
            }
            this.calendarDate = selectedDate;
        }

        public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
            if (!DatePickerPlugin.this.canceled) {
                this.calendarDate.set(11, hourOfDay);
                this.calendarDate.set(12, minute);
                this.calendarDate.set(13, 0);
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
                sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
                this.callbackContext.success(sdf.format(this.calendarDate.getTime()));
            }
        }
    }

    public DatePickerPlugin() {
        this.pluginName = "DatePickerPlugin";
        this.called = false;
        this.canceled = false;
        this.timePickerHour = 0;
        this.timePickerMinute = 0;
    }

    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) {
        Log.d("DatePickerPlugin", "DatePicker called with options: " + data);
        this.called = false;
        this.canceled = false;
        show(data, callbackContext);
        return true;
    }

    public synchronized void show(JSONArray data, CallbackContext callbackContext) {
        Runnable runnable;
        DatePickerPlugin datePickerPlugin = this;
        Context currentCtx = this.cordova.getActivity();
        JsonDate jsonDate = new JsonDate().fromJson(data);
        if (ACTION_TIME.equalsIgnoreCase(jsonDate.action)) {
            runnable = runnableTimeDialog(datePickerPlugin, currentCtx, callbackContext, jsonDate, Calendar.getInstance(TimeZone.getDefault()));
        } else {
            runnable = runnableDatePicker(datePickerPlugin, currentCtx, callbackContext, jsonDate);
        }
        this.cordova.getActivity().runOnUiThread(runnable);
    }

    private Runnable runnableTimeDialog(DatePickerPlugin datePickerPlugin, Context currentCtx, CallbackContext callbackContext, JsonDate jsonDate, Calendar calendarDate) {
        return new C00641(datePickerPlugin, callbackContext, calendarDate, currentCtx, jsonDate);
    }

    private Runnable runnableDatePicker(DatePickerPlugin datePickerPlugin, Context currentCtx, CallbackContext callbackContext, JsonDate jsonDate) {
        return new C00652(datePickerPlugin, callbackContext, jsonDate, currentCtx);
    }

    private void prepareDialog(DatePickerDialog dateDialog, OnDateSetListener dateListener, CallbackContext callbackContext, Context currentCtx, JsonDate jsonDate) {
        dateDialog.setCancelable(true);
        dateDialog.setCanceledOnTouchOutside(false);
        if (!jsonDate.todayText.isEmpty()) {
            dateDialog.setButton(-3, jsonDate.todayText, new C00663(dateDialog, dateListener));
        }
        dateDialog.setButton(-2, jsonDate.cancelText.isEmpty() ? currentCtx.getString(17039360) : jsonDate.cancelText, new C00674(callbackContext));
        dateDialog.setButton(-1, jsonDate.okText.isEmpty() ? currentCtx.getString(17039370) : jsonDate.okText, new C00685(dateDialog, dateListener));
        DatePicker dp = dateDialog.getDatePicker();
        if (jsonDate.minDate > 0) {
            dp.setMinDate(jsonDate.minDate);
        }
        if (jsonDate.maxDate > 0 && jsonDate.maxDate > jsonDate.minDate) {
            dp.setMaxDate(jsonDate.maxDate);
        }
    }

    private void prepareDialogPreHoneycomb(DatePickerDialog dateDialog, CallbackContext callbackContext, Context currentCtx, JsonDate jsonDate) {
        Field mDatePickerField = null;
        try {
            mDatePickerField = dateDialog.getClass().getDeclaredField("mDatePicker");
        } catch (NoSuchFieldException e) {
            callbackContext.error(RESULT_ERROR);
        }
        mDatePickerField.setAccessible(true);
        DatePicker pickerView = null;
        try {
            pickerView = (DatePicker) mDatePickerField.get(dateDialog);
        } catch (IllegalArgumentException e2) {
            callbackContext.error(RESULT_ERROR);
        } catch (IllegalAccessException e3) {
            callbackContext.error(RESULT_ERROR);
        }
        Calendar startDate = Calendar.getInstance();
        startDate.setTimeInMillis(jsonDate.minDate);
        Calendar endDate = Calendar.getInstance();
        endDate.setTimeInMillis(jsonDate.maxDate);
        int minYear = startDate.get(1);
        int minMonth = startDate.get(2);
        int minDay = startDate.get(5);
        int maxYear = endDate.get(1);
        int maxMonth = endDate.get(2);
        int maxDay = endDate.get(5);
        if (startDate != null || endDate != null) {
            int access$1300 = jsonDate.year;
            int access$1400 = jsonDate.month;
            int access$1500 = jsonDate.day;
            pickerView.init(access$1300, access$1400, r20, new C00696(jsonDate, maxYear, maxMonth, maxDay, minYear, minMonth, minDay));
        }
    }
}
