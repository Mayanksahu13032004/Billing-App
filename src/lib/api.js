export async function api(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Something went wrong");
  }

  return res.json();
}
