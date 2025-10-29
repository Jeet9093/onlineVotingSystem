
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ShieldCheck, User, BarChart, LogIn } from "lucide-react";

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/admin", label: "Admin", icon: ShieldCheck },
    { href: "/voter", label: "Voter Hub", icon: User },
    { href: "/results", label: "Results", icon: BarChart },
    { href: "/login", label: "Student Login", icon: LogIn },
];

export function MainNav() {
    const pathname = usePathname();
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block font-headline text-primary">
                           Virtual Polling
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                       {navLinks.map(({ href, label, icon: Icon }) => {
                           const isActive = pathname.startsWith(href) && (href !== '/' || pathname === '/');
                           return (
                            <Link
                                key={label}
                                href={href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80 flex items-center gap-2",
                                    isActive ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                <Icon className="w-4 h-4"/>
                                {label}
                            </Link>
                           )
                        })}
                    </nav>
                </div>
                 {/* Mobile Nav could go here */}
            </div>
        </header>
    );
}
