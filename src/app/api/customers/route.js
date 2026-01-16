import { connectDB } from "../../../../lib/db";
import Customer from "../../../../models/Customer";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const customer = await Customer.create(data);
  return NextResponse.json(customer);
}

export async function GET() {
  await connectDB();
  return NextResponse.json(await Customer.find());
}
