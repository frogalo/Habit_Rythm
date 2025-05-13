"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

type ButtonProps = {
    text: string;
    onClick?: () => void;
    icon?: LucideIcon;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
};

export default function Button({
                                   text,
                                   onClick,
                                   icon: Icon,
                                   className = "",
                                   type = "button",
                                   disabled = false,
                               }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow transition
        bg-[var(--purple)] hover:bg-[var(--pink)] text-[var(--foreground)]
        disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
        ${className}
      `}

        >
            {Icon && <Icon size={20} />}
            {text}
        </button>
    );
}
