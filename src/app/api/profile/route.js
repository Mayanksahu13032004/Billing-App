import { connectDB } from "@/lib/db";
import BusinessProfile from "@/models/BusinessProfile";
import { getUserFromToken } from "@/lib/auth";
import { NextResponse } from "next/server";

/* ================= GET PROFILE ================= */
export async function GET(req) {
  await connectDB();

  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await BusinessProfile.findOne({ userId: user._id });

  return NextResponse.json(profile || {});
}

/* ================= CREATE / UPDATE PROFILE ================= */
export async function POST(req) {
  await connectDB();

  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const profile = await BusinessProfile.findOneAndUpdate(
    { userId: user._id },
    { ...data, userId: user._id },
    { upsert: true, new: true }
  );

  return NextResponse.json(profile);
}
