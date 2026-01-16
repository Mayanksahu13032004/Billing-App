import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ADMIN } from "@/lib/admin";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
    // await connectDB();
  const { username, password } = await req.json();

  // 🔐 ADMIN LOGIN (HARDCODED)
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign(
      { username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const res = NextResponse.json({
      role: "admin",
      username
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/"
    });

    return res;
  }

  // 👤 USER LOGIN (DB ONLY)
  await connectDB();
  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user._id, username: user.username, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const res = NextResponse.json({
    role: "user",
    username: user.username
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/"
  });

  return res;
}
