"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  }

  const isActive = (path) => pathname === path;

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "All Bills", path: "/bills" },
    { name: "Create Bill", path: "/bills/create" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-indigo-600 p-2 rounded-lg text-white shadow-md transform group-hover:rotate-[10deg] transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">
                {user?.username || "Admin"}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-4 py-2 text-sm font-bold tracking-tight transition-all duration-300 group`}
                >
                  <span className={`relative z-10 ${isActive(link.path) ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-900"}`}>
                    {link.name}
                  </span>
                  {/* Hover & Active Background */}
                  {isActive(link.path) ? (
                    <div className="absolute inset-0 bg-indigo-50/80 rounded-xl border border-indigo-100/50"></div>
                  ) : (
                    <div className="absolute inset-0 bg-slate-100 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 rounded-xl transition-all"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-5 pl-6">
            {user && (
              <div className="hidden sm:flex items-center gap-3 py-1.5 px-3 bg-slate-50 border border-slate-200/60 rounded-full shadow-inner">
                <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                  Online
                </span>
              </div>
            )}

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-white text-slate-600 px-5 py-2.5 rounded-2xl text-xs font-black tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-90 border border-slate-200 hover:border-red-600 shadow-sm hover:shadow-red-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}