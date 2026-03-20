import { format, parseISO } from "date-fns";

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type HabitInput = {
    name: string;
    color: string;
};

export type Habit = {
    id: string;
    name: string;
    color: string;
    completions: string[];
};

type HabitApiRecord = Habit & {
    _id?: string;
};

export function normalizeHabit(habit: HabitApiRecord): Habit {
    return {
        id: habit.id || habit._id || "",
        name: habit.name,
        color: habit.color,
        completions: habit.completions,
    };
}

export function normalizeHabits(habits: HabitApiRecord[] = []): Habit[] {
    return habits.map(normalizeHabit);
}

export function getCompletedMonths(completions: string[]): string[] {
    return Array.from(
        new Set(completions.map((dateString) => format(parseISO(dateString), "yyyy-MM")))
    ).sort();
}
