import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
  billNo: Number,
  customerName: String,
  date: { type: Date, default: Date.now },
  items: [
    {
      particular: String,
      qty: Number,
      rate: Number,
      amount: Number
    }
  ],
  grandTotal: Number,
  amountInWords: String
});

export default mongoose.models.Bill ||
  mongoose.model("Bill", BillSchema);
