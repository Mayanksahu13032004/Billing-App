import mongoose from "mongoose";

const BillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // 🔥 IMPORTANT
    },

    billNo: Number,
    customerName: String,

    date: {
      type: Date,
      default: Date.now,
    },

    items: [
      {
        particular: String,
        qty: Number,
        rate: Number,
        amount: Number,
      },
    ],

    grandTotal: Number,
    amountInWords: String,
  },
  { timestamps: true }
);

export default mongoose.models.Bill ||
  mongoose.model("Bill", BillSchema);
