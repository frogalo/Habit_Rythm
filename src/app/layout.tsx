import "../styles/globals.css";
import React from "react";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import {Toaster} from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <SessionProviderWrapper>
            <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1 flex flex-col">{children}</main>
                    <Footer />
                    <Toaster position="bottom-center" />
                </div>
            </ProtectedRoute>
        </SessionProviderWrapper>
        </body>
        </html>
    );
}