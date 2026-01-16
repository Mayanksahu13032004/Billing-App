"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          router.push("/login");
        } else {
          setOk(true);
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (!ok) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        {/* Branding/Logo Loader */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulse Ring */}
          <div className="absolute h-24 w-24 rounded-full border-4 border-indigo-50 animate-ping"></div>
          
          {/* Inner Spinning Ring */}
          <div className="h-20 w-20 rounded-full border-t-4 border-indigo-600 border-r-4 border-transparent animate-spin"></div>
          
          {/* Center Icon */}
          <div className="absolute bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">
            Verifying Session
          </h3>
          <div className="mt-2 flex items-center justify-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>

        {/* Security Footer Note */}
        <p className="absolute bottom-10 text-xs text-slate-400 font-medium uppercase tracking-widest">
          Secure Environment • Gurukripa Engineering
        </p>
      </div>
    );
  }

  return <>{children}</>;
}