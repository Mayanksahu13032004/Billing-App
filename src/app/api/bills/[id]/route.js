import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Bill from "@/models/Bill";
import { getUserFromToken } from "@/lib/auth";
import { NextResponse } from "next/server";

/* ================= GET SINGLE BILL ================= */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params; // ✅ NO await

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid bill ID" },
        { status: 400 }
      );
    }

    const bill = await Bill.findOne({
      _id: id,
      userId: user._id, // 🔥 IMPORTANT
    });

    if (!bill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.error("GET BILL ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ================= DELETE BILL ================= */
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const deleted = await Bill.findOneAndDelete({
      _id: id,
      userId: user._id, // 🔥 CRITICAL
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Bill deleted" });
  } catch (error) {
    console.error("DELETE BILL ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
