"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Habit } from "@/features/habits/types";

type HabitSidebarProps = {
    habit: Habit;
    onEdit?: () => void;
    onRemove?: () => void;
};

export default function HabitSidebar({ habit, onEdit, onRemove }: HabitSidebarProps) {
    return (
        <div className="flex items-start gap-2 flex-shrink-0">
            <button
                type="button"
                title="Edit habit"
                aria-label={`Edit ${habit.name}`}
                onClick={onEdit}
                style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "0.8rem",
                    background: "var(--primary)",
                    color: "var(--on-primary)",
                    border: "1px solid rgba(121,65,36,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 10px 24px -10px rgba(121,65,36,0.45)",
                    transition: "all 0.2s ease",
                }}
                className="hover:translate-y-[-1px] hover:opacity-90"
            >
                <Pencil size={15} />
            </button>

            <button
                type="button"
                title="Remove habit"
                aria-label={`Remove ${habit.name}`}
                onClick={onRemove}
                style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "0.8rem",
                    background: "rgba(255,255,255,0.6)",
                    color: "var(--outline)",
                    border: "1px solid rgba(218,193,184,0.75)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                }}
                className="hover:border-[var(--error)] hover:text-[var(--error)]"
            >
                <Trash2 size={15} />
            </button>
        </div>
    );
}
