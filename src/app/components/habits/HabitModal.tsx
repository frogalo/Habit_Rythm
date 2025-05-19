"use client";

import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import {getRandomColor} from "@/utils/colorUtils";

type HabitModalProps = {
    open: boolean;
    onCloseAction: () => void;
    onSaveAction: (habit: { name: string; color: string }) => void;
    initialName?: string;
    initialColor?: string;
    isEditing?: boolean;
};


export default function HabitModal({
                                       open,
                                       onCloseAction,
                                       onSaveAction,
                                       initialName = "",
                                       initialColor = "#7C05F2",
                                       isEditing = false,
                                   }: HabitModalProps) {
    const [name, setName] = useState(initialName);
    const [color, setColor] = useState(initialColor);

    // Reset fields when modal opens/closes or when editing a different habit
    useEffect(() => {
        setName(initialName);
        if (isEditing) {
            setColor(initialColor);
        } else {
            setColor(getRandomColor());
        }
    }, [open, initialName, initialColor, isEditing]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onCloseAction} // <-- close on background click
        >
            <div
                className="bg-[var(--accent)] rounded-lg shadow-lg p-6 w-full max-w-xs relative"
                onClick={e => e.stopPropagation()} // <-- prevent close when clicking inside modal
            >
                <button
                    className="absolute top-2 right-2 text-[var(--foreground)] hover:text-[var(--pink)] text-3xl cursor-pointer"
                    onClick={onCloseAction}
                    aria-label="Close"
                >
                    ×
                </button>
                <h1 className="text-2xl font-bold mb-4">
                    {isEditing ? "Edit Habit" : "Add New Habit"}
                </h1>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        if (name.trim()) {
                            onSaveAction({ name: name.trim(), color });
                        }
                    }}
                >
                    <label className="block mb-2 font-medium text-xl">
                        Name
                        <input
                            type="text"
                            className="mt-1 block w-full border rounded px-2 py-1 focus:outline-none focus:ring-2"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            maxLength={32}
                            required
                            autoFocus
                        />
                    </label>
                    <label className="block mb-2 font-medium text-xl">
                        Color
                        <div className="flex items-center gap-3 mt-1">
                            <HexColorPicker color={color} onChange={setColor} />
                            <span
                                className="inline-block w-8 h-8 rounded border"
                                style={{ background: color, borderColor: color }}
                            />
                        </div>
                    </label>
                    <button
                        type="submit"
                        className="mt-4 w-full bg-[var(--purple)] text-white font-semibold py-2 rounded hover:bg-[var(--pink)] transition cursor-pointer"
                    >
                        {isEditing ? "Save Changes" : "Add Habit"}
                    </button>
                </form>
            </div>
        </div>
    );
}
