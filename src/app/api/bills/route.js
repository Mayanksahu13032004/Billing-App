import { connectDB } from "@/lib/db";
import Bill from "@/models/Bill";
import toWords from "@/lib/numberToWords";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { sendBillEmail } from "@/lib/sendBillEmail";
import generatePDF from "@/lib/generatePDF";
import BusinessProfile from "@/models/BusinessProfile";

export async function POST(req) {
  await connectDB();

  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔽 FETCH PROFILE DATA
  const profile = await BusinessProfile.findOne({ userId: user._id });

  const { customerName, customerEmail, items } = await req.json();

  const last = await Bill.findOne({ userId: user._id }).sort({ billNo: -1 });
  const billNo = last ? last.billNo + 1 : 2501;

  let total = 0;
  items.forEach((i) => {
    i.amount = i.qty * i.rate;
    total += i.amount;
  });

  const bill = await Bill.create({
    userId: user._id,
    billNo,
    customerName,
    items,
    grandTotal: total,
    amountInWords: toWords(total),
  });

  // ✅ Generate PDF WITH PROFILE
  let pdfBytes = null;
  try {
    pdfBytes = await generatePDF({ bill, profile });
  } catch (err) {
    console.error("PDF generation failed:", err);
  }

  // ✅ Send Email if customerEmail exists
  if (customerEmail && pdfBytes) {
    try {
      console.log("📧 Sending email to:", customerEmail);

    await sendBillEmail({
  to: customerEmail,
  customerName,
  billNo,
  businessName: profile?.businessName || "Billing App",  // ✅ ADD THIS
  pdfBuffer: Buffer.from(pdfBytes),
});


      console.log("✅ Email sent successfully");
    } catch (err) {
      console.error("❌ Email sending failed:", err);
    }
  }

  return NextResponse.json({
    ...bill.toObject(),
    emailSent: !!customerEmail,
  });
}

export async function GET(req) {
  await connectDB();

  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const customer = req.nextUrl.searchParams.get("customer");
  const billNo = req.nextUrl.searchParams.get("billNo");

  const filter = {
    userId: user._id, // 🔥 CRITICAL
  };

  if (customer) {
    filter.customerName = { $regex: customer, $options: "i" };
  }

  if (billNo) {
    filter.billNo = Number(billNo);
  }

  const bills = await Bill.find(filter).sort({ billNo: -1 });

  return NextResponse.json(bills);
}
