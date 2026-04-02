"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, ShieldCheck, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/login" || pathname === "/signup") return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300
      ${scrolled
        ? "bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-slate-200 dark:border-slate-700 shadow-sm"
        : "bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold font-space bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 tracking-tight">
              JobCheck AI
            </span>
          </Link>

          {/* RIGHT: Nav links + icons */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/predict"
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/predict') ? 'text-emerald-700 font-semibold' : 'text-slate-600'}`}
                >
                  Scan Job
                </Link>
                <Link
                  href="/history"
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/history') ? 'text-emerald-700 font-semibold' : 'text-slate-600'}`}
                >
                  My History
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/admin') ? 'text-emerald-700 font-semibold' : 'text-slate-600'}`}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* Divider + icons */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <Link
                    href="/profile"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 transition-all"
                    title={`${user.username} — View Profile`}
                  >
                    <User className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-500 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-4 py-1.5 rounded-full transition-all hover:shadow-lg shadow-sm hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
