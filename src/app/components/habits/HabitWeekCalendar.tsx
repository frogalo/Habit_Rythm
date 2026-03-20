"use client";

import {
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    format,
    isToday,
} from "date-fns";
import { useState, useEffect } from "react";

type HabitWeekCalendarProps = {
    habits: {
        id: string;
        name: string;
        color: string;
        completions: string[];
    }[];
    WEEKDAYS: string[];
    onToggleAction: (habitId: string, date: Date) => void;
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitWeekCalendar({
    habits,
    onToggleAction,
}: HabitWeekCalendarProps) {
    const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

    useEffect(() => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 1 });
        const end = endOfWeek(today, { weekStartsOn: 1 });
        setCurrentWeek(eachDayOfInterval({ start, end }));
    }, []);

    if (currentWeek.length === 0) return null;

    const currentDayIndex = currentWeek.findIndex((day) => isToday(day));

    return (
        <div className="grid grid-cols-7 gap-2 md:gap-4">
            {currentWeek.map((day, i) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isCurrentDay = isToday(day);
                const isAdjacentDay = Math.abs(i - currentDayIndex) === 1;
                const isFuture = day > new Date();
                const completedCount = habits.filter((h) => h.completions.includes(dateStr)).length;
                const total = habits.length;
                const allDone = total > 0 && completedCount === total;

                return (
                    <div
                        key={dateStr}
                        style={{
                            background: isCurrentDay
                                ? "var(--surface-container-lowest)"
                                : "var(--surface-container-low)",
                            borderRadius: "0.5rem",
                            border: isCurrentDay
                                ? "1px solid rgba(121,65,36,0.12)"
                                : "1px solid transparent",
                            boxShadow: isCurrentDay
                                ? "0 8px 24px -8px rgba(121,65,36,0.12)"
                                : "none",
                            opacity: isFuture ? 0.55 : 1,
                            position: "relative",
                            overflow: "hidden",
                        }}
                        className="flex flex-col items-center gap-3 p-2 md:p-4 transition-all duration-300"
                    >
                        {/* Today badge */}
                        {isCurrentDay && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    background: "var(--tertiary)",
                                    color: "var(--on-tertiary)",
                                    fontFamily: "var(--font-body)",
                                    fontSize: "8px",
                                    letterSpacing: "0.05em",
                                    borderBottomLeftRadius: "0.25rem",
                                    padding: "2px 6px",
                                }}
                                className="font-bold uppercase"
                            >
                                Today
                            </div>
                        )}

                        {/* Day label */}
                        <span
                            style={{
                                color: isCurrentDay ? "var(--primary)" : "var(--outline)",
                                fontFamily: "var(--font-body)",
                                fontSize: "10px",
                                letterSpacing: "0.15em",
                                opacity: isCurrentDay ? 1 : isAdjacentDay ? 0.78 : 0.48,
                            }}
                            className="font-extrabold uppercase"
                        >
                            {DAY_LABELS[i]}
                        </span>

                        {/* Day number */}
                        <span
                            style={{
                                color: isCurrentDay ? "var(--primary)" : "var(--on-surface-variant)",
                                fontFamily: "var(--font-headline)",
                                fontSize: isCurrentDay ? "1.5rem" : "1.1rem",
                                fontWeight: 500,
                                lineHeight: 1,
                            }}
                        >
                            {day.getDate()}
                        </span>

                        <span
                            style={{
                                color: isCurrentDay
                                    ? "var(--primary)"
                                    : "var(--on-surface-variant)",
                                fontFamily: "var(--font-body)",
                                fontSize: isCurrentDay ? "10px" : "9px",
                                letterSpacing: "0.08em",
                                opacity: isCurrentDay ? 0.9 : isAdjacentDay ? 0.64 : 0.32,
                            }}
                            className="font-bold uppercase text-center"
                        >
                            {isCurrentDay
                                ? format(day, "MMM d")
                                : isAdjacentDay
                                  ? format(day, "MMM d")
                                  : format(day, "d")}
                        </span>

                        {/* Habit dots / check area */}
                        <div className="w-full">
                            {habits.length === 0 ? (
                                <div
                                    style={{
                                        border: "2px dashed rgba(218,193,184,0.35)",
                                        borderRadius: "0.375rem",
                                        aspectRatio: "1/1",
                                    }}
                                />
                            ) : isCurrentDay ? (
                                /* Today: toggleable habit buttons */
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: habits.length === 1 ? "1fr" : "1fr 1fr",
                                        gap: "4px",
                                    }}
                                >
                                    {habits.map((habit) => {
                                        const done = habit.completions.includes(dateStr);
                                        return (
                                            <button
                                                key={habit.id}
                                                onClick={() => onToggleAction(habit.id, day)}
                                                title={`${habit.name}${done ? " ✓" : ""}`}
                                                style={{
                                                    background: done ? habit.color : "var(--surface-container-high)",
                                                    borderRadius: "0.25rem",
                                                    border: done ? "none" : "2px dashed rgba(218,193,184,0.5)",
                                                    aspectRatio: "1/1",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {done && (
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{
                                                            color: "rgba(255,255,255,0.9)",
                                                            fontSize: "0.85rem",
                                                            fontVariationSettings: "'FILL' 1",
                                                        }}
                                                    >
                                                        check
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* Past/future days: completion status block */
                                <div
                                    style={{
                                        borderRadius: "0.375rem",
                                        background: allDone
                                            ? "var(--primary)"
                                            : completedCount > 0
                                            ? "var(--surface-container-high)"
                                            : isFuture
                                            ? "transparent"
                                            : "var(--surface-container-high)",
                                        border: isFuture ? "1px solid rgba(218,193,184,0.25)" : "none",
                                        aspectRatio: "1/1",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {allDone && (
                                        <span
                                            className="material-symbols-outlined"
                                            style={{
                                                color: "var(--on-primary)",
                                                fontSize: "1rem",
                                                fontVariationSettings: "'FILL' 1",
                                            }}
                                        >
                                            check_circle
                                        </span>
                                    )}
                                    {!allDone && completedCount > 0 && !isFuture && (
                                        <span
                                            style={{
                                                color: "var(--on-surface-variant)",
                                                fontFamily: "var(--font-body)",
                                                fontSize: "9px",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {completedCount}/{total}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Progress dots (one per habit, colored) */}
                        {habits.length > 0 && (
                            <div className="flex gap-1 flex-wrap justify-center">
                                {habits.map((h) => (
                                    <span
                                        key={h.id}
                                        style={{
                                            width: "5px",
                                            height: "5px",
                                            borderRadius: "50%",
                                            background: h.completions.includes(dateStr)
                                                ? h.color
                                                : "var(--surface-container-high)",
                                            transition: "background 0.2s",
                                            flexShrink: 0,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
