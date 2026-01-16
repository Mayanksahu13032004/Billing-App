import { connectDB } from "@/lib/db";
import Bill from "@/models/Bill";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    await connectDB();

    // Total bills
    const totalBills = await Bill.countDocuments();

    // Total revenue
    const revenueAgg = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    // Monthly aggregation
    const monthlyAgg = await Bill.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          billCount: { $sum: 1 },
          revenue: { $sum: "$grandTotal" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    const monthly = monthlyAgg.map(m => ({
      month: `${m._id.month}/${m._id.year}`,
      billCount: m.billCount,
      revenue: m.revenue
    }));

    return NextResponse.json({
      totalBills,
      totalRevenue,
      monthly
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load reports" },
      { status: 500 }
    );
  }
}
