export const runtime = "nodejs"; // ✅ REQUIRED

import { connectDB } from "../../../../../../lib/db";
import Bill from "../../../../../../models/Bill";
import generatePDF from "../../../../../../lib/generatePDF";
import { NextResponse } from "next/server";



export async function GET(request, context) {
  await connectDB();

  // ✅ FIX: await params
  const { id } = await context.params;

  const bill = await Bill.findById(id);
  if (!bill) {
    return NextResponse.json(
      { error: "Bill not found" },
      { status: 404 }
    );
  }

  const pdfBuffer = await generatePDF(bill);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=bill-${bill.billNo}.pdf`,
    },
  });
}
