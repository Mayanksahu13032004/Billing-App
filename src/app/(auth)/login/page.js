"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();

    // 🍞 Start Loading Toast
    const toastId = toast.loading("Verifying credentials...");

    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      // ✅ Success Toast
      toast.success("Welcome back!", { id: toastId });

      // 🔑 ROLE-BASED REDIRECT
      if (res.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      // ❌ Error Toast
      toast.error(error.message || "Invalid credentials. Please try again.", { id: toastId });
      console.error("Login failed:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification Container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-md w-full">
        {/* BRANDING SECTION */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 mb-4 transition-transform hover:scale-105 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-4.514A11.042 11.042 0 0112 3c1.215 0 2.417.197 3.548.571m1.944 3.016A11.056 11.056 0 0115 18v1a1 1 0 01-1 1h-4a1 1 0 01-1-1v-1m12-7a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Portal <span className="text-indigo-600 uppercase italic">Login</span>
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Gurukripa Engineering
          </p>
        </div>

        {/* LOGIN FORM CARD */}
        <form
          onSubmit={handleLogin}
          className="bg-white py-10 px-8 sm:px-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100"
        >
          <div className="space-y-6">
            <div className="group">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-600 transition-colors">
                Username
              </label>
              <input
                type="text"
                required
                className="block w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

         <div className="group relative">
  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-600 transition-colors">
    Password
  </label>

  <input
    type={showPassword ? "text" : "password"}   // ✅ toggle type
    required
    className="block w-full px-5 py-4 pr-14 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300"
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  {/* 👁️ Show / Hide Button */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-[42px] text-slate-400 hover:text-indigo-600 transition-colors"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? (
      // 🙈 Eye Off Icon
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19
             c-5.523 0-10-4.477-10-10
             0-1.044.16-2.047.457-2.99M3 3l18 18M9.88 9.88
             a3 3 0 104.24 4.24" />
      </svg>
    ) : (
      // 👁️ Eye Icon
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5
             c4.478 0 8.268 2.943 9.542 7
             -1.274 4.057-5.064 7-9.542 7
             -4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
</div>

          </div>

          <div className="mt-10">
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black tracking-widest hover:bg-indigo-600 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex justify-center items-center"
            >
              SIGN IN
            </button>
          </div>

          <div className="mt-8 text-center">
            <a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors underline underline-offset-4 decoration-slate-200 decoration-2">
              Trouble logging in?
            </a>
          </div>
        </form>
        
        <p className="mt-10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Gurukripa Engineering. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}