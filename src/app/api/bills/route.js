import { connectDB } from "@/lib/db";
import Bill from "@/models/Bill";
import { verifyToken } from "@/lib/auth";
import toWords from "@/lib/numberToWords";
import { NextResponse } from "next/server";
// import { middleware } from "../../../../middleware";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req) {
  await connectDB();

  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { customerName, items } = await req.json();

  const last = await Bill.findOne({ userId: user._id }).sort({ billNo: -1 });
  const billNo = last ? last.billNo + 1 : 2501;

  let total = 0;
  items.forEach((i) => {
    i.amount = i.qty * i.rate;
    total += i.amount;
  });

  const bill = await Bill.create({
    userId: user._id, // ✅ IMPORTANT
    billNo,
    customerName,
    items,
    grandTotal: total,
    amountInWords: toWords(total),
  });

  return NextResponse.json(bill);
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
