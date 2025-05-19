"use client";

import {useEffect, useState} from "react";
import {format, parseISO} from "date-fns";
import HabitModal from "@/app/components/habits/HabitModal";
import HabitSidebar from "@/app/components/habits/HabitSidebar";
import HabitCalendar from "@/app/components/habits/HabitCalendar";
import Button from "@/app/components/buttons/Button";
import {Plus} from "lucide-react";
import ConfirmModal from "@/app/components/habits/ConfirmModal";
import {IHabit} from "@/models/User";
import toast from "react-hot-toast";

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

type Habit = {
    _id: string;
    id: string;
    name: string;
    color: string;
    completions: string[];
};

export default function MultiHabitDotCalendar() {
    const [habitStates, setHabitStates] = useState<Habit[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [habitToRemove, setHabitToRemove] = useState<Habit | null>(null);

    // Fetch habits from API on mount
    useEffect(() => {
        (async () => {
            const res = await fetch("/api/habits");
            if (res.ok) {
                const data = await res.json();
                setHabitStates(
                    data.habits.map((h: IHabit) => ({
                        ...h,
                        _id: h._id.toString(),
                        id: h._id.toString(),
                    }))
                );
            }
        })();
    }, []);

    // Add a new habit via API
    const handleAddHabit = async (habit: { name: string; color: string }) => {
        const res = await fetch("/api/habits", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(habit),
        });

        if (res.ok) {
            const data = await res.json();
            setHabitStates(
                data.habits.map((h: IHabit) => ({
                    ...h,
                    _id: h._id.toString(),
                    id: h._id.toString(),
                }))
            );
            toast.success("Habit added!");
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to add habit");
        }
    };

    const handleEditHabit = async (habit: { name: string; color: string }) => {
        if (!editingHabit) return;
        const res = await fetch(`/api/habits/${editingHabit.id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(habit),
        });

        if (res.ok) {
            const data = await res.json();
            setHabitStates(
                data.habits.map((h: IHabit) => ({
                    ...h,
                    _id: h._id.toString(),
                    id: h._id.toString(),
                }))
            );
            toast.success("Habit updated!");
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to edit habit");
        }
    };


    // Remove a habit (local only, for now)
    const handleRemoveHabit = async (habitId: string) => {
        const res = await fetch(`/api/habits/${habitId}`, {
            method: "DELETE",
        });

        if (res.ok) {
            const data = await res.json();
            setHabitStates(
                data.habits.map((h: IHabit) => ({
                    ...h,
                    _id: h._id.toString(),
                    id: h._id.toString(),
                }))
            );
            toast.success("Habit removed!");
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to remove habit");
        }
    };

    // Toggle completion for a date (local only, for now)
    const handleToggle = async (habitId: string, date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const res = await fetch(`/api/habits/${habitId}/toggle`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({date: dateStr}),
        });

        if (res.ok) {
            const data = await res.json();
            setHabitStates((prev) =>
                prev.map((habit) =>
                    habit.id === habitId
                        ? {...habit, completions: data.completions}
                        : habit
                )
            );
            toast.success("Habit updated!");
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to update habit");
        }
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
            <ConfirmModal
                open={!!habitToRemove}
                onCloseAction={() => setHabitToRemove(null)}
                onConfirmAction={() => {
                    if (habitToRemove) {
                        handleRemoveHabit(habitToRemove.id).then(() => {
                            setHabitToRemove(null);
                        });
                    } else {
                        setHabitToRemove(null);
                    }
                }}
                message={`Are you sure you want to remove "${habitToRemove?.name}"?`}
            />
            <HabitModal
                open={modalOpen}
                onCloseAction={() => {
                    setModalOpen(false);
                    setEditingHabit(null);
                }}
                onSaveAction={async (habit) => {
                    if (editingHabit) {
                        await handleEditHabit(habit);
                    } else {
                        await handleAddHabit(habit);
                    }
                    setModalOpen(false);
                    setEditingHabit(null);
                }}
                initialName={editingHabit?.name}
                initialColor={editingHabit?.color}
                isEditing={!!editingHabit}
            />
            {habitStates.map((habit) => {
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
                            }}
                            onRemove={() => setHabitToRemove(habit)}
                        />
                        <HabitCalendar
                            habit={habit}
                            monthsToShow={monthsToShow}
                            WEEKDAYS={WEEKDAYS}
                            onToggleAction={handleToggle}
                        />
                    </div>
                );
            })}
        </div>
    );
}
