import { connectDB } from "@/lib/db";
import Bill from "@/models/Bill";
import { NextResponse } from "next/server";




import { getUserFromToken } from "@/lib/auth";


export async function GET(request) {
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

    const userId = user._id;

    /* ================= TOTAL BILLS ================= */
    const totalBills = await Bill.countDocuments({ userId });

    /* ================= TOTAL REVENUE ================= */
    const revenueAgg = await Bill.aggregate([
      { $match: { userId } }, // 🔥 IMPORTANT
      {
        $group: {
          _id: null,
          total: { $sum: "$grandTotal" },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    /* ================= MONTHLY REPORT ================= */
    const monthlyAgg = await Bill.aggregate([
      { $match: { userId } }, // 🔥 IMPORTANT
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          billCount: { $sum: 1 },
          revenue: { $sum: "$grandTotal" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const monthly = monthlyAgg.map((m) => ({
      month: `${m._id.month}/${m._id.year}`,
      billCount: m.billCount,
      revenue: m.revenue,
    }));

    return NextResponse.json({
      totalBills,
      totalRevenue,
      monthly,
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load reports" },
      { status: 500 }
    );
  }
}
