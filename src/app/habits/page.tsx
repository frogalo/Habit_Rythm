"use client";

import {useSession, signIn} from "next-auth/react";
import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";

export default function HabitsPage() {
    const {data: session, status} = useSession();

    if (status === "loading") return <p>Loading...</p>;
    if (!session)
        return (
            <div>
                <p>You must be signed in to view your habits.</p>
                <button onClick={() => signIn()}>Sign in</button>
            </div>
        );

    return (
        <div>
            <h2>Your Habits</h2>
            <HabitForm/>
            <HabitList/>
        </div>
    );
}