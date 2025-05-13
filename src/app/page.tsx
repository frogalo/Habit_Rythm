"use client";

import { motion } from "framer-motion";
import { CheckCircle, TrendingUp, CalendarCheck, UserCheck } from "lucide-react";
import Button from "@/app/components/buttons/Button";
import {CirclePlay} from "lucide-react";

const features = [
    {
        icon: CheckCircle,
        title: "Track Habits Effortlessly",
        description:
            "Add, edit, and mark your daily habits with a single click. Stay consistent and build routines that last.",
    },
    {
        icon: TrendingUp,
        title: "Visualize Your Progress",
        description:
            "See your streaks, completion rates, and trends in beautiful charts. Motivation, visualized.",
    },
    {
        icon: CalendarCheck,
        title: "Flexible Scheduling",
        description:
            "Set habits for daily, weekly, or custom schedules. Habit Rhythm adapts to your lifestyle.",
    },
    {
        icon: UserCheck,
        title: "Secure & Private",
        description:
            "Your data is protected with secure authentication. Only you can see your habits.",
    },
];

export default function HomePage() {
    return (
        <main className="flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-2 px-4">
                <motion.img
                    src="/logo.png"
                    alt="Habit Rhythm Logo"
                    className="w-80 h-80 mb-6"
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2.7 }}
                />
                <motion.h1
                    className="text-5xl font-extrabold mb-6 text-[var(--pink)]"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                >
                    Habit Rhythm
                </motion.h1>
                <motion.p
                    className="text-lg mb-10 max-w-2xl text-[var(--dark)]"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                >
                    The modern way to build, track, and master your habits. Boost your productivity, stay motivated, and achieve your goals with ease.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                >
                    <Button
                        icon={CirclePlay}
                        text="Start Now"
                    />
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 bg-[var(--primary)] text-[var(--accent)]">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            className="flex items-start space-x-4 "
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: idx * 0.15, duration: 0.6 }}
                        >
                            <feature.icon
                                className="w-10 h-10 flex-shrink-0 text-[var(--purple)]"
                            />
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-[var(--accent)]">
                                    {feature.title}
                                </h3>
                                <p className="text-[var(--dark)]">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
