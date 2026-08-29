package com.tutiempo.poc;

import android.app.usage.EventStats;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.os.PowerManager;

import java.util.List;

public final class UsageTimeRepository {

    private static final long RAW_EVENTS_WINDOW_MS = 72L * 60L * 60L * 1000L;

    private final UsageStatsManager usageStatsManager;
    private final PowerManager powerManager;

    public UsageTimeRepository(Context context) {
        usageStatsManager =
                (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
    }

    /**
     * Returns the best available estimate of time that the phone's screen was
     * in Android's SCREEN_INTERACTIVE state between beginTime and endTime.
     *
     * V0.1 intentionally measures the phone screen as a whole, not specific apps.
     */
    public long getInteractiveTimeMs(long beginTime, long endTime) {
        if (endTime <= beginTime || usageStatsManager == null) {
            return 0L;
        }

        long span = endTime - beginTime;

        // Raw events are more precise around the exact start timestamp, but Android
        // only retains them for a limited period.
        if (span <= RAW_EVENTS_WINDOW_MS) {
            Long raw = queryRawEvents(beginTime, endTime);
            if (raw != null) {
                return Math.max(0L, raw);
            }
        }

        Long aggregate = queryAggregatedEventStats(beginTime, endTime);
        if (aggregate != null) {
            return Math.max(0L, aggregate);
        }

        // Last-resort fallback for a very recent measurement.
        Long raw = queryRawEvents(beginTime, endTime);
        return raw == null ? 0L : Math.max(0L, raw);
    }

    private Long queryRawEvents(long beginTime, long endTime) {
        try {
            UsageEvents events = usageStatsManager.queryEvents(beginTime, endTime);
            if (events == null) {
                return null;
            }

            UsageEvents.Event event = new UsageEvents.Event();
            boolean sawScreenEvent = false;
            boolean interactive = false;
            long activeStart = beginTime;
            long total = 0L;

            while (events.hasNextEvent()) {
                events.getNextEvent(event);
                int type = event.getEventType();

                if (type != UsageEvents.Event.SCREEN_INTERACTIVE
                        && type != UsageEvents.Event.SCREEN_NON_INTERACTIVE) {
                    continue;
                }

                long timestamp = clamp(event.getTimeStamp(), beginTime, endTime);

                if (!sawScreenEvent) {
                    sawScreenEvent = true;

                    // If the first transition is NON_INTERACTIVE, the screen had
                    // to be interactive immediately before that transition.
                    if (type == UsageEvents.Event.SCREEN_NON_INTERACTIVE) {
                        interactive = true;
                        activeStart = beginTime;
                    }
                }

                if (type == UsageEvents.Event.SCREEN_INTERACTIVE) {
                    if (!interactive) {
                        interactive = true;
                        activeStart = timestamp;
                    }
                } else if (interactive) {
                    total += Math.max(0L, timestamp - activeStart);
                    interactive = false;
                }
            }

            if (!sawScreenEvent) {
                // No transitions in the interval means the state likely remained
                // constant. This is useful for short POC intervals.
                return powerManager != null && powerManager.isInteractive()
                        ? endTime - beginTime
                        : 0L;
            }

            if (interactive) {
                total += Math.max(0L, endTime - activeStart);
            }

            return total;
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    private Long queryAggregatedEventStats(long beginTime, long endTime) {
        try {
            List<EventStats> stats = usageStatsManager.queryEventStats(
                    UsageStatsManager.INTERVAL_BEST,
                    beginTime,
                    endTime
            );

            if (stats == null || stats.isEmpty()) {
                return null;
            }

            long total = 0L;
            boolean found = false;

            for (EventStats stat : stats) {
                if (stat.getEventType() == UsageEvents.Event.SCREEN_INTERACTIVE) {
                    total += Math.max(0L, stat.getTotalTime());
                    found = true;
                }
            }

            return found ? total : null;
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    private static long clamp(long value, long min, long max) {
        return Math.max(min, Math.min(max, value));
    }
}
