"use client";

import {useState} from "react";
import {
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    format,
    isToday,
    isBefore,
    parseISO,
    getDay,
} from "date-fns";
import {Pencil, Trash2} from "lucide-react";

const initialHabits = [
    {
        id: "1",
        name: "Drink Water",
        color: "#f205de",
        completions: [
            "2025-05-15",
            "2025-05-12",
            "2025-05-11",
            "2025-05-16",
            "2025-06-01",
            "2025-02-01",
            "2025-03-01",
            "2025-04-01",
            "2025-05-01",
            "2025-06-01",
        ],
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
        name: "Dance",
        color: "#1d199b",
        completions: ["2025-04-14"],
    },
];

// Monday-first weekday labels
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper to get black or white text for contrast
function getContrastTextColor(hex: string) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#232222" : "#d9d9d9";
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
        <div className="flex flex-col gap-2 justify-center m-3">
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
                        className="flex flex-row items-stretch w-full bg-white/80 rounded-lg shadow-2xl p-4 mt-2"
                    >
                        {/* Left: Habit name and buttons */}
                        <div className="flex flex-col items-center min-w-[40px] mt-3 mr-6 h-[330px] justify-between">
                              <span
                                  className="font-bold text-md px-2 py-1 rounded border"
                                  style={{
                                      writingMode: "vertical-rl",
                                      transform: "rotate(180deg)",
                                      background: habit.color,
                                      borderColor: habit.color,
                                      color: getContrastTextColor(habit.color),
                                      fontFamily: "var(--font-main)",
                                      textAlign: "center",
                                      minHeight: "120px",
                                      display: "inline-block",
                                  }}
                              >
                                {habit.name}
                              </span>
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    type="button"
                                    className="rounded border flex items-center justify-center"
                                    style={{
                                        background: habit.color,
                                        borderColor: habit.color,
                                        color: getContrastTextColor(habit.color),
                                        cursor: "pointer",
                                        width:"34px",
                                        height: "34px",
                                    }}
                                    title="Edit habit"
                                    // onClick={() => handleEdit(habit.id)}
                                >
                                    <Pencil size={18}/>
                                </button>
                                <button
                                    type="button"
                                    className="rounded border flex items-center justify-center"
                                    style={{
                                        background: habit.color,
                                        borderColor: habit.color,
                                        color: getContrastTextColor(habit.color),
                                        cursor: "pointer",
                                        height: "34px",
                                        width:"34px"
                                    }}
                                    title="Remove habit"
                                    // onClick={() => handleRemove(habit.id)}
                                >
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        </div>

                        {/* Right: All calendars for months with completions or current month */}
                        <div className="flex-1 overflow-x-auto">
                            <div className="flex flex-row gap-6 min-w-[380px]">
                                {monthsToShow.map((monthStr) => {
                                    // Get all days in this month
                                    const monthDate = parseISO(monthStr + "-01");
                                    const days = eachDayOfInterval({
                                        start: startOfMonth(monthDate),
                                        end: endOfMonth(monthDate),
                                    });

                                    // Calculate how many empty cells to pad at the start (Monday = 0)
                                    let firstDay = getDay(startOfMonth(monthDate)); // 0 (Sunday) - 6 (Saturday)
                                    firstDay = firstDay === 0 ? 6 : firstDay - 1; // Monday=0, Sunday=6

                                    const paddedDays = [
                                        ...Array(firstDay).fill(null),
                                        ...days,
                                    ];

                                    return (
                                        <div
                                            key={monthStr}
                                            className="flex flex-col min-w-[380px] w-[380px] rounded-lg p-3 h-full"
                                        >
                                          <span
                                              className="font-bold text-sm px-3 py-1 mb-2 rounded w-fit"
                                              style={{
                                                  background: "var(--secondary)",
                                                  color: "var(--foreground)",
                                              }}
                                          >
                                            {format(monthDate, "MMMM yyyy")}
                                          </span>
                                            {/* Weekday Labels */}
                                            <div
                                                className="grid grid-cols-7 gap-2 mb-1 text-xs text-center text-gray-400 w-full">
                                                {WEEKDAYS.map((d, i) => (
                                                    <span key={`${habit.id}-${monthStr}-weekday-${i}`}>{d}</span>
                                                ))}
                                            </div>
                                            {/* Dot Calendar */}
                                            <div className="grid grid-cols-7 gap-2 w-full">
                                                {paddedDays.map((day, idx) => {
                                                    if (!day) {
                                                        return <span key={`empty-${idx}`}/>;
                                                    }
                                                    const dateStr = format(day, "yyyy-MM-dd");
                                                    const completed = habit.completions.includes(dateStr);
                                                    const isCurrentDay = isToday(day);
                                                    const isPast = isBefore(day, new Date()) && !isCurrentDay;

                                                    // Number color logic
                                                    let numberColorStyle: React.CSSProperties | undefined = undefined;
                                                    let numberColorClass = "text-[var(--dark)]";
                                                    if (completed) {
                                                        numberColorStyle = {color: getContrastTextColor(habit.color)};
                                                        numberColorClass = "";
                                                    } else if (isPast) {
                                                        numberColorClass = "text-gray-400";
                                                    } else if (isCurrentDay && !completed) {
                                                        numberColorClass = "text-[var(--pink)]";
                                                    }

                                                    // Style for today: pill shape, bolder border
                                                    const baseCircle =
                                                        "flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2";
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
                                                            className={`
                                                                ${baseCircle}
                                                                w-12 h-12
                                                                rounded-lg
                                                                border-2
                                                                ${completedStyle}
                                                                ${ringStyle}
                                                                mx-auto
                                                                relative
                                                              `}
                                                            style={{
                                                                borderColor: completed ? habit.color : undefined,
                                                                background: completed ? habit.color : undefined,
                                                                cursor: "pointer",
                                                            }}
                                                            title={dateStr}
                                                        >
                                                          <span
                                                              style={numberColorStyle}
                                                              className={`
                                                              ${numberColorClass}
                                                              text-xs
                                                              absolute
                                                              bottom-1
                                                              right-1
                                                              font-semibold
                                                              pointer-events-none
                                                            `}
                                                          >
                                                            {day.getDate()}
                                                          </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
