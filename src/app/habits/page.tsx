"use client";

import {useState} from "react";
import {
    format,
    parseISO,
} from "date-fns";
import HabitModal from "@/app/components/habits/HabitModal";
import HabitSidebar from "@/app/components/habits/HabitSidebar";
import HabitCalendar from "@/app/components/habits/HabitCalendar";
import Button from "@/app/components/buttons/Button";
import {Plus} from "lucide-react";


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
    const [modalOpen, setModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<null | typeof initialHabits[0]>(null);


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
            <Button
                text="Add Habit"
                icon={Plus}
                onClick={() => {
                    setEditingHabit(null);
                    setModalOpen(true);
                }}
                className="w-[150px]"
                type="button"
            />
            <HabitModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={habit => {
                    // handle save (add or edit)
                    setModalOpen(false);
                    setEditingHabit(null);
                }}
                initialName={editingHabit?.name}
                initialColor={editingHabit?.color}
                isEditing={!!editingHabit}
            />
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
                        <HabitSidebar
                            habit={habit}
                            onEdit={() => {
                                setEditingHabit(habit);
                                setModalOpen(true);
                                // Optionally add onEdit/onRemove handlers here

                            }}
                        />
                        <HabitCalendar
                            habit={habit}
                            monthsToShow={monthsToShow}
                            WEEKDAYS={WEEKDAYS}
                            onToggle={handleToggle}
                        />
                    </div>
                );
            })}
        </div>
    );
}
