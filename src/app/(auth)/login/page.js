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
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-slate-50/70 overflow-hidden px-4 sm:px-6 lg:px-8 perspective-1000">
      
      {/* 🏙️ ARCHITECTURAL LIGHT GEOMETRIC BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft elegant gradient blur orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-100/60 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-sky-100/50 blur-[100px]" />
        
        {/* Engineering blueprint vector-style background grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" />
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

      <div className="z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        

{/* LEFT LANDING PAGE SECTION */}

<div className="hidden lg:flex flex-col justify-center">

  <div className="max-w-2xl">

```
<div className="inline-flex items-center gap-3 mb-8">
  <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
    G
  </div>

  <div>
    <h2 className="text-2xl font-black text-slate-900">
      Smart GST Billing Platform
    </h2>

    <p className="text-slate-500">
      Professional Invoice Management
    </p>
  </div>
</div>

<h1 className="text-7xl font-black leading-none text-slate-900">
  Smart GST
  <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent">
    Billing System
  </span>
</h1>

<p className="mt-8 text-xl text-slate-600 leading-relaxed">
  Create GST invoices, generate PDF bills,
  manage customers and streamline your complete
  billing workflow with a modern cloud-based solution.
</p>

<div className="mt-14 space-y-8">

  <div className="flex items-start gap-5">
    <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">
      📄
    </div>

    <div>
      <h3 className="font-black text-xl text-slate-900">
        GST Invoice Generation
      </h3>

      <p className="text-slate-500 mt-1">
        Generate professional GST invoices instantly.
      </p>
    </div>
  </div>

  <div className="flex items-start gap-5">
    <div className="h-14 w-14 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl">
      📊
    </div>

    <div>
      <h3 className="font-black text-xl text-slate-900">
        PDF Reports
      </h3>

      <p className="text-slate-500 mt-1">
        Export invoices and MIS reports with one click.
      </p>
    </div>
  </div>

  <div className="flex items-start gap-5">
    <div className="h-14 w-14 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl">
      👥
    </div>

    <div>
      <h3 className="font-black text-xl text-slate-900">
        Customer Management
      </h3>

      <p className="text-slate-500 mt-1">
        Maintain customer records and invoice history.
      </p>
    </div>
  </div>

</div>

<div className="mt-16 border-t border-slate-200 pt-8">

  <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
    Built By
  </p>

  <h3 className="mt-3 text-2xl font-black text-slate-900">
    Mayank Sahu
  </h3>

  <p className="text-slate-500">
    mayanksahu13032004@gmail.com
  </p>

  <a
    href="https://digitalheroesco.com"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center mt-6 px-6 py-3 rounded-xl bg-black text-white font-bold hover:bg-slate-800 transition-all"
  >
    Built for Digital Heroes
  </a>

</div>
```

  </div>
</div>

{/* RIGHT AUTH SECTION */}

<div className="w-full max-w-md justify-self-center">

      
        {/* STATIC BRANDING HEADER */}
        <div className="text-center mb-8 group">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl border border-slate-200 mb-3 shadow-md transition-all duration-300 group-hover:border-indigo-500/50 group-hover:shadow-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-4.514A11.042 11.042 0 0112 3c1.215 0 2.417.197 3.548.571m1.944 3.016A11.056 11.056 0 0115 18v1a1 1 0 01-1 1h-4a1 1 0 01-1-1v-1m12-7a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Portal <span className="text-indigo-600 uppercase italic font-black">{isFlipped ? "Register" : "Login"}</span>
          </h1>
          <p className="mt-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Gurukripa Engineering
          </p>
        </div>

        {/* 3D FLIP CONTAINER MAIN WRAPPER */}
        <div className={`w-full preserve-3d duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] min-h-[520px] relative ${isFlipped ? "rotate-y-180" : ""}`}>
          
          {/* ========================================================= */}
          {/* SIDE A: LOGIN FORM FRONT                                  */}
          {/* ========================================================= */}
          <div className="absolute inset-0 backface-hidden w-full h-full">
            <form
              onSubmit={handleLogin}
              className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.06)] flex flex-col justify-between h-full"
            >
              <div className="space-y-5">
                {/* Login Username */}
                <div className="group/field">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within/field:text-indigo-600 transition-colors">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    className="block w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300"
                    placeholder="Enter username"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                  />
                </div>

                {/* Login Password */}
                <div className="group/field relative">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within/field:text-indigo-600 transition-colors">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    className="block w-full px-5 py-3.5 pr-14 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[40px] text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.044.16-2.047.457-2.99M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Login CTA Footer */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-sm tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-900/10 hover:shadow-indigo-100 transition-all active:scale-[0.98] flex justify-center items-center disabled:bg-slate-400"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : "SIGN IN"}
                </button>

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors underline underline-offset-4 decoration-slate-200"
                  >
                    Don't have an account? Sign Up
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* ========================================================= */}
          {/* SIDE B: SIGNUP FORM BACK                                  */}
          {/* ========================================================= */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full">
            <form
              onSubmit={handleSignup}
              className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.06)] flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                {/* Register Username */}
                <div className="group/field">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within/field:text-indigo-600 transition-colors">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    className="block w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300"
                    placeholder="Choose username"
                    value={signupUser}
                    onChange={(e) => setSignupUser(e.target.value)}
                  />
                </div>

                {/* Register Password */}
                <div className="group/field">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within/field:text-indigo-600 transition-colors">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    className="block w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={signupPass}
                    onChange={(e) => setSignupPass(e.target.value)}
                  />
                </div>

                {/* Register Confirm Password */}
                <div className="group/field">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within/field:text-indigo-600 transition-colors">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    className="block w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 transition-all duration-300 outline-none placeholder:text-slate-300"
                    placeholder="Re-enter password"
                    value={signupConfirmPass}
                    onChange={(e) => setSignupConfirmPass(e.target.value)}
                  />
                </div>
              </div>

              {/* Register CTA Footer */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-sm tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-900/10 hover:shadow-indigo-100 transition-all active:scale-[0.98] flex justify-center items-center disabled:bg-slate-400"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : "CREATE ACCOUNT"}
                </button>

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors underline underline-offset-4 decoration-slate-200"
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>

        {/* BOTTOM LEGAL FOOTER */}
        <p className="mt-10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Gurukripa Engineering. All Rights Reserved.
        </p>
  </div>

</div>
</div>
);
}