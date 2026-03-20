"use client";

import { useEffect, useState } from "react";
import {
    createHabit,
    deleteHabit,
    fetchHabits,
    updateHabit,
    toggleHabitCompletion,
} from "@/features/habits/api";
import type { Habit, HabitInput } from "@/features/habits/types";

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadHabits() {
            try {
                const nextHabits = await fetchHabits();

                if (!isMounted) {
                    return;
                }

                setHabits(nextHabits);
                setLoadError(null);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setLoadError(
                    error instanceof Error ? error.message : "Failed to load habits"
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadHabits();

        return () => {
            isMounted = false;
        };
    }, []);

    async function addHabit(habit: HabitInput) {
        const nextHabits = await createHabit(habit);
        setHabits(nextHabits);
    }

    async function editHabit(habitId: string, habit: HabitInput) {
        const nextHabits = await updateHabit(habitId, habit);
        setHabits(nextHabits);
    }

    async function removeHabit(habitId: string) {
        const nextHabits = await deleteHabit(habitId);
        setHabits(nextHabits);
    }

    async function toggleHabit(habitId: string, date: Date) {
        const completions = await toggleHabitCompletion(habitId, date);

        setHabits((currentHabits) =>
            currentHabits.map((habit) =>
                habit.id === habitId ? { ...habit, completions } : habit
            )
        );
    }

    return {
        habits,
        isLoading,
        loadError,
        addHabit,
        editHabit,
        removeHabit,
        toggleHabit,
    };
}
