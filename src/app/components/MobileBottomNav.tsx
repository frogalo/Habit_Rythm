"use client";

import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { icon: "auto_stories", label: "Journal",   href: "/habits"    },
    { icon: "replay",       label: "Rhythm",    href: "/habits"    },
    { icon: "analytics",    label: "Insights",  href: "/habits"    },
    { icon: "spa",          label: "Sanctuary", href: "/habits"    },
];

export default function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav
            style={{
                background: "rgba(252,249,244,0.88)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderTop: "1px solid rgba(218,193,184,0.2)",
                boxShadow: "0 -4px 20px rgba(0,0,0,0.02)",
            }}
            className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3"
            aria-label="Mobile navigation"
        >
            {NAV_ITEMS.map(({ icon, label, href }, i) => {
                const isActive = i === 0 && pathname?.startsWith("/habits");
                return (
                    <a
                        key={label}
                        href={href}
                        style={{
                            color: isActive ? "var(--primary)" : "var(--outline)",
                            background: isActive ? "rgba(196,201,176,0.3)" : "transparent",
                            borderRadius: "999px",
                            fontFamily: "var(--font-body)",
                            textDecoration: "none",
                        }}
                        className="flex flex-col items-center justify-center px-4 py-1 transition-colors"
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{
                                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                            }}
                        >
                            {icon}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
                    </a>
                );
            })}
        </nav>
    );
}
