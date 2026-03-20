import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const userHabitInclude = {
    habits: {
        include: {
            completions: {
                orderBy: {
                    date: "asc",
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    },
} satisfies Prisma.UserInclude;

export type UserWithHabits = Prisma.UserGetPayload<{
    include: typeof userHabitInclude;
}>;

export function serializeHabit(habit: UserWithHabits["habits"][number]) {
    return {
        id: habit.id,
        name: habit.name,
        color: habit.color,
        completions: habit.completions.map((completion) => completion.date),
    };
}

export function serializeHabits(habits: UserWithHabits["habits"]) {
    return habits.map(serializeHabit);
}

export async function getSerializedHabitsForUser(userId: string) {
    const habits = await prisma.habit.findMany({
        where: { userId },
        include: {
            completions: {
                orderBy: {
                    date: "asc",
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return habits.map((habit) => ({
        id: habit.id,
        name: habit.name,
        color: habit.color,
        completions: habit.completions.map((completion) => completion.date),
    }));
}
