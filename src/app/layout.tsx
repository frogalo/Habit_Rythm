import "../styles/globals.css";
import React from "react";
import type { Metadata } from "next";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "Habit Rhythm — The Living Chronology",
    description:
        "A digital sanctuary for calm momentum. Track your habits with intention using rhythmic, editorial visualisations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                {/* Google Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800&display=swap"
                    rel="stylesheet"
                />
                {/* Material Symbols */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <SessionProviderWrapper>
                    <ProtectedRoute>
                        {children}
                        <Toaster position="bottom-center" />
                    </ProtectedRoute>
                </SessionProviderWrapper>
            </body>
        </html>
    );
}
