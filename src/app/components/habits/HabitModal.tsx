"use client";

import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import type { HabitInput } from "@/features/habits/types";
import { getRandomColor } from "@/utils/colorUtils";
import { motion, AnimatePresence } from "framer-motion";

type HabitModalProps = {
    open: boolean;
    onCloseAction: () => void;
    onSaveAction: (habit: HabitInput) => void;
    initialName?: string;
    initialColor?: string;
    isEditing?: boolean;
};

/* Preset palette — the Living Chronology tones */
const PRESETS = [
    { label: "Clay",    value: "#794124" },
    { label: "Sunrise", value: "#86371c" },
    { label: "Moss",    value: "#5c614c" },
    { label: "Sand",    value: "#dac1b8" },
    { label: "Stone",   value: "#87736b" },
    { label: "Custom",  value: "" },
];

export default function HabitModal({
    open,
    onCloseAction,
    onSaveAction,
    initialName = "",
    initialColor = "#794124",
    isEditing = false,
}: HabitModalProps) {
    const [name, setName]   = useState(initialName);
    const [color, setColor] = useState(initialColor);
    const [showPicker, setShowPicker] = useState(false);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        setName(initialName);
        setColor(isEditing ? initialColor : getRandomColor());
        setShowPicker(false);
    }, [open, initialName, initialColor, isEditing]);

    if (!open) return null;

    const isPreset = PRESETS.some((p) => p.value === color && p.value !== "");

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ background: "rgba(28,28,25,0.35)" }}
                        className="fixed inset-0 z-[60] backdrop-blur-sm"
                        onClick={onCloseAction}
                    />

                    {/* Side panel */}
                    <motion.aside
                        key="panel"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 38 }}
                        style={{ background: "var(--surface-container-lowest)" }}
                        className="fixed top-0 right-0 h-full w-full md:w-[480px] z-[70] shadow-2xl flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Panel header */}
                        <div className="px-8 pt-12 pb-8 flex justify-between items-start">
                            <div>
                                <p
                                    style={{
                                        color: "var(--outline)",
                                        fontFamily: "var(--font-body)",
                                        fontSize: "10px",
                                        letterSpacing: "0.25em",
                                    }}
                                    className="uppercase font-bold mb-2"
                                >
                                    Refining Momentum
                                </p>
                                <h2
                                    style={{ color: "var(--primary)", fontFamily: "var(--font-headline)" }}
                                    className="text-4xl font-medium tracking-tight italic"
                                >
                                    {isEditing ? "Edit Habit" : "New Ritual"}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={onCloseAction}
                                style={{ borderRadius: "50%", color: "var(--outline)" }}
                                className="p-2 hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Panel body */}
                        <form
                            className="flex-1 flex flex-col overflow-hidden"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (name.trim()) onSaveAction({ name: name.trim(), color });
                            }}
                        >
                            <div className="flex-1 px-8 overflow-y-auto space-y-12 pb-8">

                                {/* Identity / name */}
                                <section>
                                    <label
                                        htmlFor="habit-name"
                                        style={{
                                            color: "var(--outline)",
                                            fontFamily: "var(--font-body)",
                                            fontSize: "10px",
                                            letterSpacing: "0.25em",
                                        }}
                                        className="uppercase font-bold mb-4 block"
                                    >
                                        Identity
                                    </label>
                                    <input
                                        id="habit-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onFocus={() => setFocused(true)}
                                        onBlur={() => setFocused(false)}
                                        maxLength={32}
                                        required
                                        autoFocus
                                        placeholder="What is the rhythm?"
                                        style={{
                                            width: "100%",
                                            background: "transparent",
                                            border: "none",
                                            borderBottom: focused
                                                ? "1px solid var(--primary)"
                                                : "1px solid rgba(218,193,184,0.3)",
                                            padding: "1rem 0.25rem",
                                            fontFamily: "var(--font-headline)",
                                            fontSize: "1.75rem",
                                            color: "var(--on-surface)",
                                            outline: "none",
                                            transition: "border-color 0.3s",
                                        }}
                                    />
                                </section>

                                {/* Visual tone / color */}
                                <section>
                                    <label
                                        style={{
                                            color: "var(--outline)",
                                            fontFamily: "var(--font-body)",
                                            fontSize: "10px",
                                            letterSpacing: "0.25em",
                                        }}
                                        className="uppercase font-bold mb-5 block"
                                    >
                                        Visual Tone
                                    </label>

                                    {/* Preset swatches */}
                                    <div className="flex flex-wrap gap-3 mb-5">
                                        {PRESETS.filter((p) => p.value !== "").map((preset) => (
                                            <button
                                                key={preset.value}
                                                type="button"
                                                title={preset.label}
                                                onClick={() => { setColor(preset.value); setShowPicker(false); }}
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    borderRadius: "50%",
                                                    background: preset.value,
                                                    border: color === preset.value
                                                        ? `3px solid ${preset.value}`
                                                        : "3px solid transparent",
                                                    outline: color === preset.value
                                                        ? "2px solid rgba(218,193,184,0.6)"
                                                        : "none",
                                                    outlineOffset: "3px",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {color === preset.value && (
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{
                                                            color: "rgba(255,255,255,0.9)",
                                                            fontSize: "1rem",
                                                            fontVariationSettings: "'FILL' 1",
                                                        }}
                                                    >
                                                        check
                                                    </span>
                                                )}
                                            </button>
                                        ))}

                                        {/* Custom picker toggle */}
                                        <button
                                            type="button"
                                            onClick={() => setShowPicker((p) => !p)}
                                            title="Custom color"
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                borderRadius: "50%",
                                                background: !isPreset ? color : "var(--surface-container-high)",
                                                border: "2px dashed rgba(218,193,184,0.5)",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "all 0.2s",
                                            }}
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                style={{
                                                    color: !isPreset ? "rgba(255,255,255,0.8)" : "var(--outline)",
                                                    fontSize: "1rem",
                                                }}
                                            >
                                                palette
                                            </span>
                                        </button>
                                    </div>

                                    {/* Hex color picker */}
                                    <AnimatePresence>
                                        {showPicker && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <HexColorPicker color={color} onChange={setColor} style={{ width: "100%" }} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Color preview swatch */}
                                    <div className="flex items-center gap-3 mt-4">
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "0.25rem",
                                                background: color,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontFamily: "var(--font-body)",
                                                color: "var(--outline)",
                                                fontSize: "11px",
                                                letterSpacing: "0.1em",
                                            }}
                                            className="uppercase font-bold"
                                        >
                                            {color}
                                        </span>
                                    </div>
                                </section>
                            </div>

                            {/* Panel footer */}
                            <div
                                style={{ borderTop: "1px solid rgba(218,193,184,0.12)" }}
                                className="p-8 flex flex-col gap-3"
                            >
                                <button
                                    type="submit"
                                    disabled={!name.trim()}
                                    style={{
                                        background: "var(--primary)",
                                        color: "var(--on-primary)",
                                        fontFamily: "var(--font-body)",
                                        borderRadius: "999px",
                                        boxShadow: "0 20px 40px -12px rgba(121,65,36,0.25)",
                                    }}
                                    className="w-full py-5 font-bold text-xs uppercase tracking-[0.3em] hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isEditing ? "Save Habit" : "Add to Rhythm"}
                                </button>
                                <button
                                    type="button"
                                    onClick={onCloseAction}
                                    style={{
                                        color: "var(--primary)",
                                        fontFamily: "var(--font-body)",
                                        background: "transparent",
                                    }}
                                    className="w-full py-4 font-bold text-xs uppercase tracking-widest hover:underline underline-offset-4 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
