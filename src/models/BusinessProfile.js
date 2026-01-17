import mongoose from "mongoose";

const BusinessProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },

    businessName: String,
    ownerName: String,
    businessType: {
      type: String,
      enum: ["Proprietor", "Partnership", "Private Limited", "LLP"],
      default: "Proprietor",
    },

    gstNumber: String,
    panNumber: String,

    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },

    contact: {
      phone: String,
      email: String,
      website: String,
    },

    bank: {
      bankName: String,
      accountNumber: String,
      ifsc: String,
    },

    invoiceSettings: {
      invoicePrefix: { type: String, default: "INV" },
      gstPercentage: { type: Number, default: 18 },
      terms: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.BusinessProfile ||
  mongoose.model("BusinessProfile", BusinessProfileSchema);
