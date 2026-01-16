import { redirect } from "next/navigation";

export default async function HomePage() {
  let res;

  try {
    res = await fetch("/api/auth/me", {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Auth check failed:", error);
    redirect("/login");
  }

  if (!res || !res.ok) {
    redirect("/login");
  }

  redirect("/dashboard");
}
