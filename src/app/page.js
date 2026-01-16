import { redirect } from "next/navigation";

export default async function HomePage() {
  // check auth from server
  const res = await fetch("api/auth/me", {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/login");
  }

  redirect("/dashboard");

  // This fallback UI is seen momentarily during the redirect process
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Modern Spinner */}
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
            Authenticating
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Please wait while we prepare your dashboard...
          </p>
        </div>
      </div>
      
      {/* Decorative background element for a "real website" feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}