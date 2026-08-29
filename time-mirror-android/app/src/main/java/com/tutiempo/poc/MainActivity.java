package com.tutiempo.poc;

import android.app.Activity;
import android.app.AppOpsManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Process;
import android.os.SystemClock;
import android.provider.Settings;
import android.view.Gravity;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends Activity {

    private static final String PREFS = "tu_tiempo_poc";
    private static final String KEY_INTRO_ACCEPTED = "intro_accepted";
    private static final String KEY_STARTED_AT = "started_at";

    private static final long SECOND = 1000L;
    private static final long MINUTE = 60L * SECOND;
    private static final long HOUR = 60L * MINUTE;
    private static final long DAY = 24L * HOUR;
    private static final long WEEK = 7L * DAY;
    private static final long MONTH = 30L * DAY;
    private static final long YEAR = 365L * DAY;

    private final Handler handler = new Handler(Looper.getMainLooper());

    private SharedPreferences prefs;
    private UsageTimeRepository usageTimeRepository;

    private Screen currentScreen = Screen.INTRO;

    private TextView primaryTime;
    private TextView secondaryTime;
    private TextView sinceText;

    private long snapshotDurationMs = 0L;
    private long snapshotElapsedRealtime = 0L;
    private long snapshotEpochMs = 0L;

    private final Runnable counterTicker = new Runnable() {
        @Override
        public void run() {
            if (currentScreen != Screen.COUNTER) {
                return;
            }

            long nowElapsed = SystemClock.elapsedRealtime();

            if (snapshotEpochMs == 0L
                    || System.currentTimeMillis() - snapshotEpochMs >= 10_000L) {
                refreshUsageSnapshot();
                nowElapsed = SystemClock.elapsedRealtime();
            }

            long visibleSinceSnapshot = Math.max(0L, nowElapsed - snapshotElapsedRealtime);
            renderDuration(snapshotDurationMs + visibleSinceSnapshot);

            handler.postDelayed(this, 1000L);
        }
    };

    private enum Screen {
        INTRO,
        PERMISSION,
        START,
        COUNTER
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        configureWindow();
        prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        usageTimeRepository = new UsageTimeRepository(this);
        routeInitialScreen();
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (prefs == null) {
            return;
        }

        long startedAt = prefs.getLong(KEY_STARTED_AT, 0L);

        if (startedAt > 0L) {
            if (hasUsageAccess()) {
                showCounterScreen();
            } else {
                showPermissionScreen();
            }
            return;
        }

        if (prefs.getBoolean(KEY_INTRO_ACCEPTED, false)
                && currentScreen == Screen.PERMISSION
                && hasUsageAccess()) {
            showStartScreen();
        }
    }

    @Override
    protected void onPause() {
        stopCounterTicker();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        stopCounterTicker();
        super.onDestroy();
    }

    private void routeInitialScreen() {
        long startedAt = prefs.getLong(KEY_STARTED_AT, 0L);

        if (startedAt > 0L) {
            if (hasUsageAccess()) {
                showCounterScreen();
            } else {
                showPermissionScreen();
            }
            return;
        }

        if (prefs.getBoolean(KEY_INTRO_ACCEPTED, false)) {
            if (hasUsageAccess()) {
                showStartScreen();
            } else {
                showPermissionScreen();
            }
            return;
        }

        showIntroScreen();
    }

    private void configureWindow() {
        Window window = getWindow();
        window.setStatusBarColor(Color.BLACK);
        window.setNavigationBarColor(Color.BLACK);
        window.getDecorView().setSystemUiVisibility(0);
    }

    private void showIntroScreen() {
        stopCounterTicker();
        currentScreen = Screen.INTRO;

        LinearLayout root = newRoot();
        root.addView(header("TU TIEMPO"));

        LinearLayout center = centerContainer();
        center.addView(title("¿QUERÉS\nSABERLO?"));
        center.addView(body("Cuánto de tu tiempo pasa frente a esta pantalla."));
        root.addView(center, weighted());

        Button action = primaryButton("QUIERO SABERLO");
        action.setOnClickListener(v -> {
            prefs.edit().putBoolean(KEY_INTRO_ACCEPTED, true).apply();

            if (hasUsageAccess()) {
                showStartScreen();
            } else {
                showPermissionScreen();
            }
        });
        root.addView(action);
        setContentView(root);
    }

    private void showPermissionScreen() {
        stopCounterTicker();
        currentScreen = Screen.PERMISSION;

        LinearLayout root = newRoot();
        root.addView(header("ANTES DE MEDIR"));

        LinearLayout center = centerContainer();
        center.addView(title("ANDROID\nNECESITA\nPERMISO."));
        center.addView(body(
                "Para contar el uso real del teléfono, habilitá “Acceso de uso” "
                        + "para TU TIEMPO · POC.\n\n"
                        + "Tus datos permanecen en este teléfono."
        ));

        root.addView(center, weighted());

        Button action = primaryButton("ABRIR AJUSTES");
        action.setOnClickListener(v -> openUsageAccessSettings());
        root.addView(action);
        setContentView(root);
    }

    private void showStartScreen() {
        stopCounterTicker();
        currentScreen = Screen.START;

        LinearLayout root = newRoot();
        root.addView(header("ANTES DE EMPEZAR"));

        LinearLayout center = centerContainer();

        TextView zero = new TextView(this);
        zero.setText("00:00:00");
        zero.setTextColor(Color.rgb(244, 244, 239));
        zero.setTextSize(55f);
        zero.setGravity(Gravity.CENTER);
        zero.setTypeface(Typeface.create("sans-serif-light", Typeface.NORMAL));
        zero.setLetterSpacing(-0.035f);
        center.addView(zero, fullWidth());

        TextView warning = bodyCentered(
                "Una vez que empieces,\neste número no volverá a cero."
        );
        warning.setPadding(0, dp(28), 0, 0);
        center.addView(warning);

        TextView quiet = smallCentered("No son puntos. No es una racha.\nEs tiempo.");
        quiet.setPadding(0, dp(14), 0, 0);
        center.addView(quiet);

        root.addView(center, weighted());

        Button action = primaryButton("EMPEZAR");
        action.setOnClickListener(v -> {
            if (!hasUsageAccess()) {
                showPermissionScreen();
                return;
            }

            long now = System.currentTimeMillis();
            prefs.edit().putLong(KEY_STARTED_AT, now).apply();
            showCounterScreen();
        });
        root.addView(action);
        setContentView(root);
    }

    private void showCounterScreen() {
        if (!hasUsageAccess()) {
            showPermissionScreen();
            return;
        }

        stopCounterTicker();
        currentScreen = Screen.COUNTER;

        LinearLayout root = newRoot();
        root.addView(header("TU TIEMPO"));

        LinearLayout center = centerContainer();

        TextView label = smallCentered("FRENTE A ESTA PANTALLA");
        label.setLetterSpacing(0.20f);
        center.addView(label);

        primaryTime = new TextView(this);
        primaryTime.setTextColor(Color.rgb(244, 244, 239));
        primaryTime.setTextSize(58f);
        primaryTime.setGravity(Gravity.CENTER);
        primaryTime.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        primaryTime.setLetterSpacing(-0.045f);
        primaryTime.setPadding(0, dp(22), 0, 0);
        center.addView(primaryTime, fullWidth());

        secondaryTime = new TextView(this);
        secondaryTime.setTextColor(Color.rgb(145, 145, 140));
        secondaryTime.setTextSize(17f);
        secondaryTime.setGravity(Gravity.CENTER);
        secondaryTime.setTypeface(Typeface.create("sans-serif", Typeface.NORMAL));
        secondaryTime.setPadding(0, dp(14), 0, 0);
        center.addView(secondaryTime, fullWidth());

        sinceText = smallCentered("");
        sinceText.setPadding(0, dp(26), 0, 0);
        center.addView(sinceText, fullWidth());

        root.addView(center, weighted());

        TextView technical = smallCentered("V0.1 · DATO LOCAL DE ANDROID");
        technical.setTextColor(Color.rgb(65, 65, 62));
        technical.setPadding(0, dp(8), 0, dp(4));
        root.addView(technical, fullWidth());

        setContentView(root);

        long startedAt = prefs.getLong(KEY_STARTED_AT, System.currentTimeMillis());
        SimpleDateFormat format = new SimpleDateFormat("dd MMM yyyy", new Locale("es", "AR"));
        sinceText.setText(("DESDE " + format.format(new Date(startedAt))).toUpperCase(new Locale("es", "AR")));

        refreshUsageSnapshot();
        renderDuration(snapshotDurationMs);
        startCounterTicker();
    }

    private void refreshUsageSnapshot() {
        long startedAt = prefs.getLong(KEY_STARTED_AT, 0L);
        long now = System.currentTimeMillis();

        snapshotDurationMs = usageTimeRepository.getInteractiveTimeMs(startedAt, now);
        snapshotElapsedRealtime = SystemClock.elapsedRealtime();
        snapshotEpochMs = now;
    }

    private void renderDuration(long durationMs) {
        if (primaryTime == null || secondaryTime == null) {
            return;
        }

        durationMs = Math.max(0L, durationMs);

        if (durationMs < DAY) {
            primaryTime.setText(formatClock(durationMs));
            secondaryTime.setText("");
            return;
        }

        if (durationMs < WEEK) {
            long days = durationMs / DAY;
            long remainder = durationMs % DAY;
            primaryTime.setText(unit(days, "DÍA", "DÍAS"));
            secondaryTime.setText(formatClock(remainder));
            return;
        }

        if (durationMs < MONTH) {
            long weeks = durationMs / WEEK;
            long remainder = durationMs % WEEK;
            long days = remainder / DAY;
            remainder %= DAY;
            primaryTime.setText(unit(weeks, "SEMANA", "SEMANAS"));
            secondaryTime.setText(unit(days, "día", "días") + " · " + formatClock(remainder));
            return;
        }

        if (durationMs < YEAR) {
            long months = durationMs / MONTH;
            long remainder = durationMs % MONTH;
            long weeks = remainder / WEEK;
            remainder %= WEEK;
            long days = remainder / DAY;
            remainder %= DAY;
            long hours = remainder / HOUR;

            primaryTime.setText(unit(months, "MES", "MESES"));
            secondaryTime.setText(
                    unit(weeks, "semana", "semanas")
                            + " · " + unit(days, "día", "días")
                            + " · " + unit(hours, "hora", "horas")
            );
            return;
        }

        long years = durationMs / YEAR;
        long remainder = durationMs % YEAR;
        long months = remainder / MONTH;
        remainder %= MONTH;
        long weeks = remainder / WEEK;
        remainder %= WEEK;
        long days = remainder / DAY;
        remainder %= DAY;
        long hours = remainder / HOUR;

        primaryTime.setText(unit(years, "AÑO", "AÑOS"));
        secondaryTime.setText(
                unit(months, "mes", "meses")
                        + " · " + unit(weeks, "semana", "semanas")
                        + " · " + unit(days, "día", "días")
                        + " · " + unit(hours, "hora", "horas")
        );
    }

    private String formatClock(long durationMs) {
        long totalSeconds = durationMs / SECOND;
        long hours = totalSeconds / 3600L;
        long minutes = (totalSeconds % 3600L) / 60L;
        long seconds = totalSeconds % 60L;

        return String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds);
    }

    private String unit(long value, String singular, String plural) {
        return value + " " + (value == 1L ? singular : plural);
    }

    private boolean hasUsageAccess() {
        AppOpsManager appOps = (AppOpsManager) getSystemService(Context.APP_OPS_SERVICE);
        if (appOps == null) {
            return false;
        }

        int mode = appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                getPackageName()
        );

        return mode == AppOpsManager.MODE_ALLOWED;
    }

    private void openUsageAccessSettings() {
        try {
            startActivity(new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS));
        } catch (RuntimeException ignored) {
            startActivity(new Intent(Settings.ACTION_SETTINGS));
        }
    }

    private void startCounterTicker() {
        stopCounterTicker();
        handler.post(counterTicker);
    }

    private void stopCounterTicker() {
        handler.removeCallbacks(counterTicker);
    }

    private LinearLayout newRoot() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setPadding(dp(26), dp(28), dp(26), dp(28));
        root.setBackgroundColor(Color.rgb(3, 3, 3));
        root.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        return root;
    }

    private TextView header(String text) {
        TextView view = new TextView(this);
        view.setText(text);
        view.setTextColor(Color.rgb(105, 105, 100));
        view.setTextSize(11f);
        view.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        view.setLetterSpacing(0.20f);
        view.setGravity(Gravity.START);
        return view;
    }

    private LinearLayout centerContainer() {
        LinearLayout center = new LinearLayout(this);
        center.setOrientation(LinearLayout.VERTICAL);
        center.setGravity(Gravity.CENTER);
        return center;
    }

    private TextView title(String text) {
        TextView view = new TextView(this);
        view.setText(text);
        view.setTextColor(Color.rgb(245, 245, 241));
        view.setTextSize(49f);
        view.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        view.setGravity(Gravity.START);
        view.setLetterSpacing(-0.045f);
        view.setLineSpacing(0f, 0.88f);
        return view;
    }

    private TextView body(String text) {
        TextView view = new TextView(this);
        view.setText(text);
        view.setTextColor(Color.rgb(145, 145, 139));
        view.setTextSize(16f);
        view.setTypeface(Typeface.create("sans-serif", Typeface.NORMAL));
        view.setGravity(Gravity.START);
        view.setLineSpacing(dp(3), 1.08f);
        view.setPadding(0, dp(28), 0, 0);
        return view;
    }

    private TextView bodyCentered(String text) {
        TextView view = body(text);
        view.setGravity(Gravity.CENTER);
        return view;
    }

    private TextView smallCentered(String text) {
        TextView view = new TextView(this);
        view.setText(text);
        view.setTextColor(Color.rgb(92, 92, 88));
        view.setTextSize(11f);
        view.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        view.setGravity(Gravity.CENTER);
        return view;
    }

    private Button primaryButton(String text) {
        Button button = new Button(this);
        button.setText(text);
        button.setTextColor(Color.rgb(8, 8, 8));
        button.setTextSize(14f);
        button.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        button.setAllCaps(false);
        button.setGravity(Gravity.CENTER);
        button.setPadding(dp(18), 0, dp(18), 0);

        GradientDrawable background = new GradientDrawable();
        background.setColor(Color.rgb(243, 243, 238));
        background.setCornerRadius(dp(18));
        button.setBackground(background);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(60)
        );
        button.setLayoutParams(params);
        return button;
    }

    private LinearLayout.LayoutParams weighted() {
        return new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1f
        );
    }

    private LinearLayout.LayoutParams fullWidth() {
        return new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
