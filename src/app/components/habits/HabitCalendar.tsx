"use client";

import {
    eachDayOfInterval,
    endOfMonth,
    format,
    isAfter,
    isToday,
    parseISO,
    startOfDay,
    subDays,
} from "date-fns";
import type { Habit } from "@/features/habits/types";

type HabitCalendarProps = {
    habit: Habit;
    monthsToShow: string[];
    onToggleAction: (habitId: string, date: Date) => void;
};

const WINDOW_DAYS = 30;

function hexToRgba(hex: string, alpha: number) {
    const normalized = hex.replace("#", "");
    const fullHex =
        normalized.length === 3
            ? normalized
                  .split("")
                  .map((value) => value + value)
                  .join("")
            : normalized;
    const r = parseInt(fullHex.slice(0, 2), 16);
    const g = parseInt(fullHex.slice(2, 4), 16);
    const b = parseInt(fullHex.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getWindowEnd(monthsToShow: string[], today: Date) {
    const activeMonth = monthsToShow.at(-1);

    if (!activeMonth || activeMonth === format(today, "yyyy-MM")) {
        return today;
    }

    return endOfMonth(parseISO(`${activeMonth}-01`));
}

function getCurrentStreak(completionSet: Set<string>, today: Date) {
    let cursor = startOfDay(today);

    if (!completionSet.has(format(cursor, "yyyy-MM-dd"))) {
        cursor = subDays(cursor, 1);
    }

    let streak = 0;

    while (completionSet.has(format(cursor, "yyyy-MM-dd"))) {
        streak += 1;
        cursor = subDays(cursor, 1);
    }

    return streak;
}

function getStatusTone(streak: number, completedCount: number) {
    if (streak >= 21) {
        return { label: "Mastery", color: "var(--tertiary)", background: "var(--tertiary-fixed)" };
    }

    if (streak >= 10) {
        return { label: "Consistent", color: "var(--secondary)", background: "var(--secondary-fixed)" };
    }

    if (completedCount >= 12) {
        return { label: "Rising", color: "var(--primary)", background: "var(--primary-fixed)" };
    }

    return { label: "Fresh", color: "var(--outline)", background: "var(--surface-container-high)" };
}

export default function HabitCalendar({
    habit,
    monthsToShow,
    onToggleAction,
}: HabitCalendarProps) {
    const today = startOfDay(new Date());
    const windowEnd = startOfDay(getWindowEnd(monthsToShow, today));
    const windowStart = subDays(windowEnd, WINDOW_DAYS - 1);
    const days = eachDayOfInterval({ start: windowStart, end: windowEnd });
    const completionSet = new Set(habit.completions);
    const completedCount = days.filter((day) =>
        completionSet.has(format(day, "yyyy-MM-dd"))
    ).length;
    const completionRate = Math.round((completedCount / WINDOW_DAYS) * 100);
    const streak = getCurrentStreak(completionSet, windowEnd);
    const statusTone = getStatusTone(streak, completedCount);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <p
                        style={{
                            color: "var(--outline-variant)",
                            fontFamily: "var(--font-body)",
                            fontSize: "10px",
                            letterSpacing: "0.22em",
                        }}
                        className="font-extrabold uppercase"
                    >
                        Monthly Flux
                    </p>
                    <p
                        style={{
                            color: "var(--outline)",
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                        }}
                        className="font-semibold uppercase"
                    >
                        {format(windowStart, "MMM d")} - {format(windowEnd, "MMM d")}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-end gap-1">
                        <span
                            style={{
                                color: "var(--primary)",
                                fontFamily: "var(--font-headline)",
                            }}
                            className="text-3xl italic leading-none"
                        >
                            {streak}
                        </span>
                        <span
                            style={{
                                color: "var(--outline)",
                                fontFamily: "var(--font-body)",
                                fontSize: "10px",
                                letterSpacing: "0.18em",
                            }}
                            className="mb-1 font-extrabold uppercase"
                        >
                            Streak
                        </span>
                    </div>
                    <span
                        style={{
                            color: statusTone.color,
                            background: statusTone.background,
                            fontFamily: "var(--font-body)",
                        }}
                        className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]"
                    >
                        {statusTone.label}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {days.map((day) => {
                    const dateString = format(day, "yyyy-MM-dd");
                    const isCompleted = completionSet.has(dateString);
                    const isCurrentDay = isToday(day);
                    const isFuture = isAfter(day, today);
                    const baseBackground = isCompleted
                        ? habit.color
                        : isFuture
                          ? "rgba(255,255,255,0.6)"
                          : hexToRgba(habit.color, 0.24);

                    return (
                        <button
                            key={dateString}
                            type="button"
                            onClick={() => onToggleAction(habit.id, day)}
                            title={format(day, "EEE, MMM d")}
                            aria-label={`${habit.name} on ${format(day, "MMMM d")}`}
                            style={{
                                background: baseBackground,
                                border: isCurrentDay
                                    ? `1.5px solid ${habit.color}`
                                    : "1px solid transparent",
                                boxShadow: isCompleted
                                    ? `inset 0 1px 0 ${hexToRgba("#ffffff", 0.2)}`
                                    : "none",
                            }}
                            className="aspect-square rounded-[0.35rem] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary-fixed-dim)] focus:ring-offset-2 focus:ring-offset-[var(--surface-container-low)]"
                        >
                            <span className="sr-only">{dateString}</span>
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                    style={{
                        color: "var(--on-surface-variant)",
                        fontFamily: "var(--font-body)",
                    }}
                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]"
                >
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: habit.color }}
                    />
                    {completedCount}/{WINDOW_DAYS} check-ins
                </div>
                <p
                    style={{
                        color: "var(--outline)",
                        fontFamily: "var(--font-body)",
                    }}
                    className="text-[11px] font-bold uppercase tracking-[0.18em]"
                >
                    {completionRate}% rhythm
                </p>
            </div>
        </div>
    );
}
