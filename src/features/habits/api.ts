import { format } from "date-fns";
import {
    Habit,
    HabitInput,
    normalizeHabits,
} from "@/features/habits/types";

type HabitsResponse = {
    habits: Habit[];
};

type ToggleHabitResponse = {
    completions: string[];
};

type ErrorResponse = {
    error?: string;
};

export class HabitRequestError extends Error {}

async function readJson<T>(response: Response): Promise<T> {
    const payload = (await response.json().catch(() => ({}))) as T & ErrorResponse;

    if (!response.ok) {
        throw new HabitRequestError(payload.error || "Request failed");
    }

    return payload;
}

async function sendHabitRequest(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<HabitsResponse> {
    const response = await fetch(input, init);
    return readJson<HabitsResponse>(response);
}

export async function fetchHabits(): Promise<Habit[]> {
    const { habits } = await sendHabitRequest("/api/habits");
    return normalizeHabits(habits);
}

export async function createHabit(habit: HabitInput): Promise<Habit[]> {
    const { habits } = await sendHabitRequest("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habit),
    });

    return normalizeHabits(habits);
}

export async function updateHabit(
    habitId: string,
    habit: HabitInput
): Promise<Habit[]> {
    const { habits } = await sendHabitRequest(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habit),
    });

    return normalizeHabits(habits);
}

export async function deleteHabit(habitId: string): Promise<Habit[]> {
    const { habits } = await sendHabitRequest(`/api/habits/${habitId}`, {
        method: "DELETE",
    });

    return normalizeHabits(habits);
}

export async function toggleHabitCompletion(
    habitId: string,
    date: Date
): Promise<string[]> {
    const response = await fetch(`/api/habits/${habitId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: format(date, "yyyy-MM-dd") }),
    });
    const { completions } = await readJson<ToggleHabitResponse>(response);

    return completions;
}
