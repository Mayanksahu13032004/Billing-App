import { connectDB } from "@/lib/db";
import BusinessProfile from "@/models/BusinessProfile";
import { getUserFromToken } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
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

  const formData = await req.formData();
  const data = {};

  /* ---------- Parse form fields ---------- */
  for (const [key, value] of formData.entries()) {
    if (key === "logo") continue;

    // Convert nested JSON strings back to objects
    if (["address", "contact", "bank", "invoiceSettings"].includes(key)) {
      data[key] = JSON.parse(value);
    } else {
      data[key] = value;
    }
  }

  /* ---------- Upload logo if exists ---------- */
  const file = formData.get("logo");
  if (file && typeof file === "object") {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "business-logos" },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    data.logo = uploadResult.secure_url;
  }

  /* ---------- Save profile ---------- */
  const profile = await BusinessProfile.findOneAndUpdate(
    { userId: user._id },
    { ...data, userId: user._id },
    { upsert: true, new: true }
  );

  return NextResponse.json(profile);
}
