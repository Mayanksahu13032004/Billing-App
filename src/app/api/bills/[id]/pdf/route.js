export const runtime = "nodejs";

import { connectDB } from "@/lib/db";
import Bill from "@/models/Bill";
import BusinessProfile from "@/models/BusinessProfile";
import generatePDF from "@/lib/generatePDF";
import { getUserFromToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();

    /* ================= AUTH ================= */
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ================= PARAM ================= */
    const { id } =await params;   // ✅ FIX: no await

    /* ================= BILL ================= */
    const bill = await Bill.findOne({
      _id: id,
      userId: user._id,
    });

    if (!bill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }

    /* ================= BUSINESS PROFILE ================= */
    const profile = await BusinessProfile.findOne({
      userId: user._id,
    });

    // 🔽 Inject username into bill object (for footer)
    const billWithUser = {
      ...bill.toObject(),
      username: user.name,
    };

    /* ================= PDF ================= */
    const pdfBuffer = await generatePDF({
      bill: billWithUser,   // ✅ CORRECT
      profile,             // ✅ CORRECT
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=bill-${bill.billNo}.pdf`,
      },
    });

  } catch (error) {
    console.error("PDF ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
