"use client";

import { motion, AnimatePresence } from "framer-motion";

type ConfirmModalProps = {
    open: boolean;
    onCloseAction: () => void;
    onConfirmAction: () => void;
    message?: string;
};

export default function ConfirmModal({
    open,
    onCloseAction,
    onConfirmAction,
    message = "Are you sure?",
}: ConfirmModalProps) {
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
                        transition={{ duration: 0.2 }}
                        style={{ background: "rgba(28,28,25,0.35)" }}
                        className="fixed inset-0 z-[70] backdrop-blur-sm"
                        onClick={onCloseAction}
                    />

                    {/* Dialog card */}
                    <motion.div
                        key="dialog"
                        initial={{ opacity: 0, scale: 0.94, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 12 }}
                        transition={{ type: "spring", stiffness: 380, damping: 38 }}
                        style={{
                            background: "var(--surface-container-lowest)",
                            borderRadius: "1.5rem",
                            boxShadow: "0 48px 80px -24px rgba(121,65,36,0.12)",
                            border: "1px solid rgba(218,193,184,0.2)",
                            maxWidth: "400px",
                            width: "calc(100% - 3rem)",
                        }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] p-10 flex flex-col gap-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "50%",
                                background: "var(--error-container)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ color: "var(--error)", fontSize: "1.5rem" }}
                            >
                                delete_forever
                            </span>
                        </div>

                        {/* Copy */}
                        <div className="flex flex-col gap-2">
                            <h2
                                style={{ color: "var(--on-surface)", fontFamily: "var(--font-headline)" }}
                                className="text-3xl font-medium"
                            >
                                Remove Ritual?
                            </h2>
                            <p
                                style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
                                className="text-sm leading-relaxed"
                            >
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={onConfirmAction}
                                style={{
                                    background: "var(--error)",
                                    color: "var(--on-error)",
                                    fontFamily: "var(--font-body)",
                                    borderRadius: "999px",
                                }}
                                className="w-full py-4 font-bold text-xs uppercase tracking-[0.3em] hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
                            >
                                Yes, Remove
                            </button>
                            <button
                                type="button"
                                onClick={onCloseAction}
                                style={{
                                    color: "var(--on-surface-variant)",
                                    fontFamily: "var(--font-body)",
                                    background: "transparent",
                                }}
                                className="w-full py-3 font-bold text-xs uppercase tracking-widest hover:underline underline-offset-4 cursor-pointer"
                            >
                                Keep It
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
