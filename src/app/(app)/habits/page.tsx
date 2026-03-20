"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import HabitModal from "@/app/components/habits/HabitModal";
import HabitSidebar from "@/app/components/habits/HabitSidebar";
import HabitCalendar from "@/app/components/habits/HabitCalendar";
import HabitWeekCalendar from "@/app/components/habits/HabitWeekCalendar";
import ConfirmModal from "@/app/components/habits/ConfirmModal";
import toast from "react-hot-toast";
import { getCompletedMonths, WEEKDAY_LABELS } from "@/features/habits/types";
import { HabitRequestError } from "@/features/habits/api";
import { useHabits } from "@/features/habits/useHabits";
import type { Habit, HabitInput } from "@/features/habits/types";
import { motion, AnimatePresence } from "framer-motion";

export default function HabitsPage() {
    const { habits, isLoading, loadError, addHabit, editHabit, removeHabit, toggleHabit } = useHabits();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [habitToRemove, setHabitToRemove] = useState<Habit | null>(null);
    const currentMonthStr = format(new Date(), "yyyy-MM");
    const today = new Date();

    useEffect(() => {
        if (loadError) toast.error(loadError);
    }, [loadError]);

    async function handleSaveHabit(habit: HabitInput) {
        try {
            if (editingHabit) {
                await editHabit(editingHabit.id, habit);
                toast.success("Habit updated.");
            } else {
                await addHabit(habit);
                toast.success("Habit added.");
            }
            setModalOpen(false);
            setEditingHabit(null);
        } catch (error) {
            toast.error(error instanceof HabitRequestError ? error.message : "Failed to save habit");
        }
    }

    async function handleRemoveHabit(habitId: string) {
        try {
            await removeHabit(habitId);
            toast.success("Habit removed.");
        } catch (error) {
            toast.error(error instanceof HabitRequestError ? error.message : "Failed to remove habit");
            throw error;
        }
    }

    async function handleToggleHabit(habitId: string, date: Date) {
        try {
            await toggleHabit(habitId, date);
        } catch (error) {
            toast.error(error instanceof HabitRequestError ? error.message : "Failed to update habit");
        }
    }

    async function handleConfirmRemove() {
        if (!habitToRemove) return;
        await handleRemoveHabit(habitToRemove.id);
        setHabitToRemove(null);
    }

    return (
        <div style={{ background: "var(--background)", minHeight: "100vh" }}>
            <main className="pt-8 pb-32 px-6 md:px-12 max-w-7xl mx-auto">

                {/* ── Page header ── */}
                <section className="mb-14">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <p
                                style={{ color: "var(--outline)", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em" }}
                                className="uppercase font-bold mb-2"
                            >
                                The Current Cycle
                            </p>
                            <h1
                                style={{ color: "var(--primary)", fontFamily: "var(--font-headline)" }}
                                className="text-5xl md:text-6xl font-medium tracking-tight"
                            >
                                Weekly Rhythm
                            </h1>
                        </div>
                        <div
                            style={{
                                background: "var(--surface-container-low)",
                                color: "var(--primary)",
                                borderRadius: "999px",
                                fontFamily: "var(--font-body)",
                            }}
                            className="flex items-center gap-3 px-6 py-3 self-start md:self-auto"
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "1.1rem" }}>calendar_today</span>
                            <span className="font-bold text-sm tracking-wide">
                                {format(today, "MMM d")} — {format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay())), "MMM d")}
                            </span>
                        </div>
                    </div>

                    {/* Weekly calendar */}
                    {isLoading ? (
                        <div
                            style={{ background: "var(--surface-container-low)", borderRadius: "0.5rem", fontFamily: "var(--font-body)", color: "var(--outline)" }}
                            className="p-12 text-center text-xs uppercase tracking-widest animate-pulse"
                        >
                            Loading your rhythm…
                        </div>
                    ) : (
                        <HabitWeekCalendar
                            habits={habits}
                            WEEKDAYS={WEEKDAY_LABELS}
                            onToggleAction={handleToggleHabit}
                        />
                    )}
                </section>

                {/* ── Habits section ── */}
                <section>
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p
                                style={{ color: "var(--outline)", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em" }}
                                className="uppercase font-bold mb-2"
                            >
                                Your Rituals
                            </p>
                            <h2
                                style={{ color: "var(--on-surface)", fontFamily: "var(--font-headline)" }}
                                className="text-4xl font-medium tracking-tight"
                            >
                                Monthly Flux
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <AnimatePresence>
                            {habits.map((habit, idx) => {
                                const completedMonths = getCompletedMonths(habit.completions);
                                const monthsToShow = completedMonths.includes(currentMonthStr)
                                    ? completedMonths
                                    : [...completedMonths, currentMonthStr];
                                const totalCompletions = habit.completions.length;

                                return (
                                    <motion.div
                                        key={habit.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                                        style={{
                                            background:
                                                "linear-gradient(180deg, rgba(255,255,255,0.66), rgba(246,243,238,0.82))",
                                            borderRadius: "1rem",
                                            border: "1px solid rgba(218,193,184,0.45)",
                                            boxShadow: "0 18px 40px -28px rgba(121,65,36,0.24)",
                                        }}
                                        className="flex flex-col gap-8 p-7 md:p-8 transition-colors duration-300"
                                    >
                                        <div className="flex justify-between items-start gap-6">
                                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                                                <h3
                                                    style={{ color: "var(--primary)", fontFamily: "var(--font-headline)" }}
                                                    className="text-3xl md:text-[2.1rem] font-medium tracking-tight truncate"
                                                >
                                                    {habit.name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                                        style={{ background: habit.color }}
                                                    />
                                                    <span
                                                        style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.22em" }}
                                                        className="uppercase font-bold"
                                                    >
                                                        Ritual • {totalCompletions} total check-ins
                                                    </span>
                                                </div>
                                            </div>
                                            <HabitSidebar
                                                habit={habit}
                                                onEdit={() => { setEditingHabit(habit); setModalOpen(true); }}
                                                onRemove={() => setHabitToRemove(habit)}
                                            />
                                        </div>

                                        <HabitCalendar
                                            habit={habit}
                                            monthsToShow={monthsToShow}
                                            onToggleAction={handleToggleHabit}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Add new habit card */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: habits.length * 0.08 }}
                            onClick={() => { setEditingHabit(null); setModalOpen(true); }}
                            style={{
                                border: "2px dashed rgba(218,193,184,0.4)",
                                borderRadius: "0.75rem",
                                fontFamily: "var(--font-body)",
                                cursor: "pointer",
                            }}
                            className="flex flex-col items-center justify-center gap-4 p-12 text-center hover:border-[rgba(121,65,36,0.4)] group transition-colors duration-300 min-h-[200px]"
                            whileHover={{ scale: 1.01 }}
                        >
                            <div
                                style={{
                                    background: "var(--surface-container)",
                                    borderRadius: "50%",
                                    width: "4rem",
                                    height: "4rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                className="group-hover:bg-[rgba(121,65,36,0.05)] transition-colors"
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ color: "var(--outline)", fontSize: "1.75rem" }}
                                >
                                    add_circle
                                </span>
                            </div>
                            <div>
                                <h4
                                    style={{ color: "var(--outline)", fontFamily: "var(--font-headline)" }}
                                    className="text-2xl group-hover:text-[var(--primary)] transition-colors"
                                >
                                    Start a New Chapter
                                </h4>
                                <p
                                    style={{ color: "var(--outline-variant)", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em" }}
                                    className="uppercase font-bold mt-2"
                                >
                                    Add a ritual to your rhythm
                                </p>
                            </div>
                        </motion.button>
                    </div>
                </section>
            </main>

            {/* Modals */}
            <HabitModal
                open={modalOpen}
                onCloseAction={() => { setModalOpen(false); setEditingHabit(null); }}
                onSaveAction={handleSaveHabit}
                initialName={editingHabit?.name}
                initialColor={editingHabit?.color}
                isEditing={!!editingHabit}
            />
            <ConfirmModal
                open={!!habitToRemove}
                onCloseAction={() => setHabitToRemove(null)}
                onConfirmAction={handleConfirmRemove}
                message={`Remove "${habitToRemove?.name}" from your rhythm?`}
            />
        </div>
    );
}
