"use client";
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
import {getContrastTextColor} from "@/utils/colorUtils";

type HabitCalendarProps = {
    habit: {
        id: string;
        color: string;
        completions: string[];
    };
    monthsToShow: string[];
    WEEKDAYS: string[];
    onToggle: (habitId: string, date: Date) => void;
};


export default function HabitCalendar({
                                          habit,
                                          monthsToShow,
                                          WEEKDAYS,
                                          onToggle,
                                      }: HabitCalendarProps) {
    return (
        <div className="flex-1 overflow-x-auto">
            <div className="flex flex-row gap-6 min-w-[380px]">
                {monthsToShow.map((monthStr) => {
                    const monthDate = parseISO(monthStr + "-01");
                    const days = eachDayOfInterval({
                        start: startOfMonth(monthDate),
                        end: endOfMonth(monthDate),
                    });

                    let firstDay = getDay(startOfMonth(monthDate));
                    firstDay = firstDay === 0 ? 6 : firstDay - 1;

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
                            <div className="grid grid-cols-7 gap-2 mb-1 text-xs text-center text-gray-400 w-full">
                                {WEEKDAYS.map((d, i) => (
                                    <span key={`${habit.id}-${monthStr}-weekday-${i}`}>{d}</span>
                                ))}
                            </div>
                            {/* Dot Calendar */}
                            <div className="grid grid-cols-7 gap-2 w-full">
                                {paddedDays.map((day, idx) => {
                                    if (!day) {
                                        return <span key={`empty-${habit.id}-${monthStr}-${idx}`}/>;
                                    }
                                    const dateStr = format(day, "yyyy-MM-dd");
                                    const completed = habit.completions.includes(dateStr);
                                    const isCurrentDay = isToday(day);
                                    const isPast = isBefore(day, new Date()) && !isCurrentDay;

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
                                            onClick={() => onToggle(habit.id, day)}
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
    );
}
