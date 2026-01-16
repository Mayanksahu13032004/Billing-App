import { connectDB } from "../../../../../lib/db";
import Bill from "../../../../../models/Bill";

import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();

  const { id } =await params; // ✅ correct

  const bill = await Bill.findById(id);
  if (!bill) {
    return NextResponse.json(
      { error: "Bill not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(bill);
}

export async function DELETE(request, { params }) {
  await connectDB();

  const { id } = params; // ✅ correct
  await Bill.findByIdAndDelete(id);

  return NextResponse.json({ message: "Bill deleted" });
}
