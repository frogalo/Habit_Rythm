"use client";
import React from "react";

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
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onCloseAction}
        >
            <div
                className="bg-[var(--accent)] rounded-lg shadow-lg p-6 w-full max-w-xs relative"
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-[var(--foreground)] hover:text-[var(--pink)] text-3xl cursor-pointer"
                    onClick={onCloseAction}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-4">Confirm</h2>
                <p className="mb-6 text-[var(--foreground)]">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded bg-[var(--dark)] hover:bg-[var(--purple)] font-semibold cursor-pointer"
                        onClick={onCloseAction}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition cursor-pointer"
                        onClick={() => {
                            onConfirmAction();
                            onCloseAction();
                        }}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
