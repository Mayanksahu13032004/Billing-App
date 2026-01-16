// import { connectDB } from "@/lib/db";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const { username, password } = await req.json();

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed });

  return NextResponse.json({ message: "User created" });
}
