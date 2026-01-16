import { connectDB } from "@/lib/db";
import Bill from "@/models/Bill";
import { verifyToken } from "@/lib/auth";
import toWords from "@/lib/numberToWords";
import { NextResponse } from "next/server";
// import { middleware } from "../../../../middleware";
export async function POST(req) {
  await connectDB();
  const { customerName, items } = await req.json();

  const last = await Bill.findOne().sort({ billNo: -1 });
  const billNo = last ? last.billNo + 1 : 2501;

  let total = 0;
  items.forEach(i => {
    i.amount = i.qty * i.rate;
    total += i.amount;
  });

  const bill = await Bill.create({
    billNo,
    customerName,
    items,
    grandTotal: total,
    amountInWords: toWords(total)
  });

  return NextResponse.json(bill);
}

export async function GET(req) {
  await connectDB();

  // ✅ Correct way in Next.js App Router
  const customer = req.nextUrl.searchParams.get("customer");
  const billNo = req.nextUrl.searchParams.get("billNo");

  const filter = {};

  if (customer) {
    filter.customerName = { $regex: customer, $options: "i" };
  }

  if (billNo) {
    filter.billNo = Number(billNo);
  }

  const bills = await Bill.find(filter).sort({ billNo: -1 });

  return NextResponse.json(bills);
}