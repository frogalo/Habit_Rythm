type MockHabit = {
    name: string;
    color: string;
    completions: string[];
};

export type MockUserConfig = {
    enabled: boolean;
    email: string;
    password: string;
    name: string;
    permissions: string[];
};

function normalizeList(value: string | undefined): string[] {
    return (value ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function formatDateOffset(daysAgo: number) {
    const date = new Date();

    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);

    return date.toISOString().slice(0, 10);
}

export function getMockUserConfig(): MockUserConfig {
    const email = process.env.TEST_USER_EMAIL?.trim() ?? "";
    const password = process.env.TEST_USER_PASSWORD?.trim() ?? "";

    return {
        enabled: process.env.MOCK_AUTH_ENABLED === "true" && !!email && !!password,
        email,
        password,
        name: process.env.TEST_USER_NAME?.trim() || "Test User",
        permissions: normalizeList(process.env.TEST_USER_PERMISSIONS),
    };
}

export function buildMockHabits(): MockHabit[] {
    return [
        {
            name: "Morning Run",
            color: "#1C7ED6",
            completions: [0, 1, 3, 5, 8, 10].map(formatDateOffset),
        },
        {
            name: "Read 20 Min",
            color: "#E8590C",
            completions: [0, 2, 4, 6, 7, 9, 12].map(formatDateOffset),
        },
        {
            name: "Deep Work",
            color: "#2F9E44",
            completions: [1, 2, 3, 4, 7, 11].map(formatDateOffset),
        },
    ];
}

export function normalizePermissions(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter(
        (permission): permission is string =>
            typeof permission === "string" && permission.trim().length > 0
    );
}
