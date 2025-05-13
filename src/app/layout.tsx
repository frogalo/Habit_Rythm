import "../styles/globals.css";
import React from "react";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="h-screen overflow-hidden">
        <SessionProviderWrapper>
            <div className="flex flex-col h-screen">
                <Header />
                <main className="flex-1 flex flex-col min-h-0">{children}</main>
                <Footer />
            </div>
        </SessionProviderWrapper>
        </body>
        </html>
    );
}
