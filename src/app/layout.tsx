import "../../src/app/styles/globals.css";
import React from "react";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <SessionProviderWrapper>
            <header>
                <h1>Habit Rhythm</h1>
            </header>
            <main>{children}</main>
        </SessionProviderWrapper>
        </body>
        </html>
    );
}