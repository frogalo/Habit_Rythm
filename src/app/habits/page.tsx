"use client";

import { useState } from "react";
import {
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    format,
    isToday,
    isBefore,
    parseISO,
} from "date-fns";

const initialHabits = [
    {
        id: "1",
        name: "Drink Water",
        color: "#f205de",
        completions: ["2025-05-15", "2025-05-16", "2025-06-01"],
    },
    {
        id: "2",
        name: "Read Book",
        color: "#05f2d6",
        completions: ["2025-05-14", "2025-06-10"],
    },
    {
        id: "3",
        name: "Think",
        color: "#399b19",
        completions: ["2025-04-14", "2025-05-15"],
    },
    {
        id: "4",
        name: "Think",
        color: "#1d199b",
        completions: ["2025-04-14"],
    },
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// Helper to get black or white text for contrast
function getContrastTextColor(hex: string) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "text-black" : "text-white";
}

// Helper to get unique months with completions for a habit
function getCompletedMonths(completions: string[]) {
    const months = completions.map((dateStr) => {
        const date = parseISO(dateStr);
        return format(date, "yyyy-MM");
    });
    return Array.from(new Set(months)).sort();
}

export default function MultiHabitDotCalendar() {
    const [habitStates, setHabitStates] = useState(initialHabits);

    const handleToggle = (habitId: string, date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        setHabitStates((prev) =>
            prev.map((habit) =>
                habit.id === habitId
                    ? {
                        ...habit,
                        completions: habit.completions.includes(dateStr)
                            ? habit.completions.filter((d) => d !== dateStr)
                            : [...habit.completions, dateStr],
                    }
                    : habit
            )
        );
    };

    return (
        <div className="flex flex-col gap-8 justify-center m-3">
            {habitStates.map((habit) => {
                // Get all months with completions for this habit
                const completedMonths = getCompletedMonths(habit.completions);
                const currentMonthStr = format(new Date(), "yyyy-MM");
                const monthsToShow = completedMonths.includes(currentMonthStr)
                    ? completedMonths
                    : [...completedMonths, currentMonthStr];

                return (
                    <div
                        key={habit.id}
                        className="flex flex-row items-start w-full bg-white/80 rounded-lg shadow p-4 mt-2"
                    >
                        {/* Left: Habit name */}
                        <div className="flex flex-col items-start min-w-[160px] mr-6">
                            <h2 className="mb-2 font-bold text-md" style={{ color: habit.color }}>
                                {habit.name}
                            </h2>
                        </div>
                        {/* Right: All calendars for months with completions or current month */}
                        <div className="flex flex-row gap-6">
                            {monthsToShow.map((monthStr) => {
                                // Get all days in this month
                                const monthDate = parseISO(monthStr + "-01");
                                const days = eachDayOfInterval({
                                    start: startOfMonth(monthDate),
                                    end: endOfMonth(monthDate),
                                });

                                return (
                                    <div
                                        key={monthStr}
                                        className="flex flex-col items-center w-[380px] bg-white rounded-lg shadow p-3"
                                    >
                    <span
                        className="font-bold text-sm px-3 py-1 mb-2 rounded border"
                        style={{
                            background: "var(--accent)",
                            borderColor: "var(--accent)",
                            color: "var(--foreground)",
                        }}
                    >
                      {format(monthDate, "MMMM yyyy")}
                    </span>
                                        {/* Weekday Labels */}
                                        <div className="grid grid-cols-7 gap-2 mb-1 text-xs text-center text-gray-400 w-full">
                                            {WEEKDAYS.map((d, i) => (
                                                <span key={`${habit.id}-${monthStr}-weekday-${i}`}>{d}</span>
                                            ))}
                                        </div>
                                        {/* Dot Calendar */}
                                        <div className="grid grid-cols-7 gap-2 w-full">
                                            {days.map((day) => {
                                                const dateStr = format(day, "yyyy-MM-dd");
                                                const completed = habit.completions.includes(dateStr);
                                                const isCurrentDay = isToday(day);
                                                const isPast = isBefore(day, new Date()) && !isCurrentDay;

                                                // Number color logic
                                                let numberColor = "text-[var(--dark)]";
                                                if (completed) numberColor = getContrastTextColor(habit.color);
                                                else if (isPast) numberColor = "text-gray-400";
                                                if (isCurrentDay && !completed) numberColor = "text-[var(--pink)]";

                                                // Style for today: pill shape, bolder border
                                                const baseCircle =
                                                    "flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2";
                                                const circleSize = isCurrentDay
                                                    ? "w-12 h-7 rounded-full border-2"
                                                    : "w-7 h-7 rounded-full border-2";
                                                const completedStyle = completed
                                                    ? "shadow-lg"
                                                    : "border-gray-300 bg-white hover:bg-[var(--secondary)]";
                                                const ringStyle = isCurrentDay
                                                    ? "focus:ring-[var(--yellow)]"
                                                    : "focus:ring-[var(--secondary)]";

                                                return (
                                                    <button
                                                        key={dateStr}
                                                        onClick={() => handleToggle(habit.id, day)}
                                                        className={`${baseCircle} ${circleSize} ${completedStyle} ${ringStyle}`}
                                                        style={{
                                                            borderColor: completed ? habit.color : undefined,
                                                            background: completed ? habit.color : undefined,
                                                        }}
                                                        title={dateStr}
                                                    >
                                                        <span className={numberColor}>{day.getDate()}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
