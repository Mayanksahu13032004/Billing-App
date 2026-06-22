"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();
  
  // Animation & Visibility States
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form States
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  
  // Signup Form States
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupConfirmPass, setSignupConfirmPass] = useState("");

  // 🔐 HANDLE LOGIN SUBMIT
  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Verifying credentials...");

    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });

      toast.success("Welcome back!", { id: toastId });

      if (res.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Invalid credentials. Please try again.", { id: toastId });
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // 📝 HANDLE SIGNUP SUBMIT
  async function handleSignup(e) {
    e.preventDefault();

    if (signupPass !== signupConfirmPass) {
      return toast.error("Passwords do not match!");
    }

    setIsLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      await api("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username: signupUser, password: signupPass }),
      });

      toast.success("Account created successfully!", { id: toastId });
      
      setSignupUser("");
      setSignupPass("");
      setSignupConfirmPass("");
      
      setTimeout(() => {
        setIsFlipped(false);
      }, 1000);

    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.", { id: toastId });
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col justify-start lg:justify-center bg-slate-50/70 overflow-x-hidden overflow-y-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 perspective-1000">
      
      {/* 🏙️ ARCHITECTURAL LIGHT GEOMETRIC BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-indigo-100/60 blur-[60px] sm:blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-sky-100/50 blur-[80px] sm:blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] opacity-40" />
      </div>

      {/* ⚠️ INLINE UTILITIES FOR FLIP EFFECTS */}
      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* Toast Notification Container */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            borderRadius: '1rem',
            fontWeight: '600'
          }
        }} 
      />

      {/* MAIN CONTAINER GRID: Changes layout seamlessly from single column to grid */}
      <div className="z-10 w-full max-w-xl lg:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* LEFT LANDING PAGE SECTION (Now fully visible and adaptive on all mobile sizes) */}
        <div className="flex flex-col justify-center w-full">
          <div className="w-full">
            
            <div className="inline-flex items-center gap-3 mb-6 lg:mb-8 group">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-md transition-transform duration-300 group-hover:scale-105">
                G
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Smart GST Billing Platform
                </h2>
                <p className="text-slate-500 font-semibold text-xs sm:text-sm">
                  Professional Invoice Management
                </p>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-7xl font-black leading-tight sm:leading-none text-slate-900 tracking-tight">
              Smart GST{" "}
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent pb-1 sm:pb-2">
                Billing System
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg xl:text-xl text-slate-600 font-semibold leading-relaxed">
              Create GST invoices, generate PDF bills, manage customers, and streamline your complete billing workflow with a modern cloud-based solution.
            </p>

            {/* FEATURE CARDS (Optimized spacing for modern mobile scanning) */}
            <div className="mt-8 lg:mt-10 space-y-4 sm:space-y-5">
              <div className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-md hover:shadow-slate-100 border border-transparent hover:border-slate-100">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                  📄
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    GST Invoice Generation
                  </h3>
                  <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-0.5">
                    Generate professional GST invoices instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-md hover:shadow-slate-100 border border-transparent hover:border-slate-100">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-sky-100 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                  📊
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    PDF Reports
                  </h3>
                  <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-0.5">
                    Export invoices and MIS reports with one click.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-md hover:shadow-slate-100 border border-transparent hover:border-slate-100">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-violet-100 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                  👥
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    Customer Management
                  </h3>
                  <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-0.5">
                    Maintain customer records and invoice history.
                  </p>
                </div>
              </div>
            </div>

            {/* AUTHOR FOOTER (Hides beautifully into an inline element or keeps minimal structure) */}
            <div className="mt-8 lg:mt-12 border-t border-slate-200/80 pt-6">
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                Built By
              </p>
              <h3 className="mt-1 sm:mt-2 text-lg sm:text-xl font-black text-slate-900">
                Mayank Sahu
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">
                mayanksahu13032004@gmail.com
              </p>
              <a
                href="https://digitalheroesco.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-slate-950 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 active:scale-[0.98] shadow-md shadow-slate-950/10 transition-all"
              >
                Built for Digital Heroes
              </a>
            </div>

          </div>
        </div>

        {/* RIGHT AUTH SECTION */}
        <div className="w-full max-w-md justify-self-center mt-4 lg:mt-0">
          
          {/* STATIC BRANDING HEADER */}
          <div className="text-center mb-6 lg:mb-8 group">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl border border-slate-200 mb-3 shadow-md transition-all duration-300 group-hover:border-indigo-500/50 group-hover:shadow-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-4.514A11.042 11.042 0 0112 3c1.215 0 2.417.197 3.548.571m1.944 3.016A11.056 11.056 0 0115 18v1a1 1 0 01-1 1h-4a1 1 0 01-1-1v-1m12-7a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Portal <span className="text-indigo-600 uppercase italic font-black">{isFlipped ? "Register" : "Login"}</span>
            </h1>
            <p className="mt-1.5 text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              Gurukripa Engineering
            </p>
          </div>

          {/* 3D FLIP CONTAINER MAIN WRAPPER */}
          <div className={`w-full preserve-3d duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] min-h-[500px] sm:min-h-[520px] relative ${isFlipped ? "rotate-y-180" : ""}`}>
            
            {/* FRONT SIDE: LOGIN FORM */}
            <div className="absolute inset-0 backface-hidden w-full h-full">
              <form
                onSubmit={handleLogin}
                className="bg-white p-5 sm:p-10 rounded-[2rem] border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.06)] flex flex-col justify-between h-full hover:border-slate-300/80 transition-colors duration-300"
              >
                <div className="space-y-4 sm:space-y-5">
                  <div className="group/field">
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within/field:text-indigo-600 transition-colors">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isLoading}
                      className="block w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-900 font-semibold hover:border-slate-200 focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300 text-sm sm:text-base"
                      placeholder="Enter username"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                    />
                  </div>

                  <div className="group/field relative">
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within/field:text-indigo-600 transition-colors">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      className="block w-full px-4 sm:px-5 py-3 sm:py-3.5 pr-12 sm:pr-14 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-900 font-semibold hover:border-slate-200 focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300 text-sm sm:text-base"
                      placeholder="••••••••"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[36px] sm:top-[40px] text-slate-300 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.044.16-2.047.457-2.99M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white py-3.5 sm:py-4 rounded-xl font-semibold text-xs sm:text-sm tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-900/10 hover:shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 flex justify-center items-center disabled:bg-slate-400"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : "SIGN IN"}
                  </button>

                  <div className="mt-4 sm:mt-5 text-center">
                    <button
                      type="button"
                      onClick={() => setIsFlipped(true)}
                      className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-colors underline underline-offset-4 decoration-slate-200"
                    >
                      Don't have an account? Sign Up
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* BACK SIDE: SIGNUP FORM */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full">
              <form
                onSubmit={handleSignup}
                className="bg-white p-5 sm:p-10 rounded-[2rem] border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.06)] flex flex-col justify-between h-full hover:border-slate-300/80 transition-colors duration-300"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="group/field">
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within/field:text-indigo-600 transition-colors">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isLoading}
                      className="block w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-900 font-semibold hover:border-slate-200 focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300 text-sm sm:text-base"
                      placeholder="Choose username"
                      value={signupUser}
                      onChange={(e) => setSignupUser(e.target.value)}
                    />
                  </div>

                  <div className="group/field">
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within/field:text-indigo-600 transition-colors">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      className="block w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-900 font-semibold hover:border-slate-200 focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300 text-sm sm:text-base"
                      placeholder="••••••••"
                      value={signupPass}
                      onChange={(e) => setSignupPass(e.target.value)}
                    />
                  </div>

                  <div className="group/field">
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within/field:text-indigo-600 transition-colors">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      className="block w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-900 font-semibold hover:border-slate-200 focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300 text-sm sm:text-base"
                      placeholder="Re-enter password"
                      value={signupConfirmPass}
                      onChange={(e) => setSignupConfirmPass(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-5 sm:mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white py-3.5 sm:py-4 rounded-xl font-semibold text-xs sm:text-sm tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-900/10 hover:shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 flex justify-center items-center disabled:bg-slate-400"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : "CREATE ACCOUNT"}
                  </button>

                  <div className="mt-4 sm:mt-5 text-center">
                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-colors underline underline-offset-4 decoration-slate-200"
                    >
                      Already have an account? Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>

          {/* BOTTOM LEGAL FOOTER */}
          <p className="mt-8 sm:mt-10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} Gurukripa Engineering. All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
  );
}