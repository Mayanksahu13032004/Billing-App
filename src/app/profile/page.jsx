"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    businessName: "",
    ownerName: "",
    businessType: "Proprietor",
    gstNumber: "",
    panNumber: "",
    address: { line1: "", city: "", state: "", pincode: "", country: "India" },
    contact: { phone: "", email: "", website: "" },
    bank: { bankName: "", accountNumber: "", ifsc: "" },
    invoiceSettings: { invoicePrefix: "INV", gstPercentage: 18, terms: "" },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data) setProfile((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveProfile = async () => {
    const toastId = toast.loading("Updating business profile...");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated successfully!", { id: toastId });
      setIsEditing(false); // Switch back to view mode
    } catch (err) {
      toast.error("Failed to save profile", { id: toastId });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 pb-12 transition-all duration-500">
        <Toaster position="top-center" />
        <Navbar />

        <main className="max-w-5xl mx-auto p-4 sm:p-8">
          {/* Header Card */}
        {/* Header Card - Updated to Very Dark */}
{/* Optimized Compact Header - Slate-950 */}
<div className="relative bg-slate-950 rounded-t-3xl p-6 sm:px-10 sm:py-8 overflow-hidden shadow-2xl border-b border-white/5">
  {/* Subtle Background Watermark */}
  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
    <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  </div>

  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-1">
        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-black tracking-widest rounded-full uppercase">
          Verified Business
        </span>
        <span className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">
          Est. 2024
        </span>
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase italic leading-tight">
        {profile.businessName || "Your Company Name"}
      </h1>
      
      <p className="text-slate-100 text-xs font-bold mt-1">
        {profile.ownerName} <span className="mx-2 opacity-30">|</span> {profile.businessType}
      </p>
    </div>

    {/* Responsive Button: Full width on mobile, auto on desktop */}
    <button
      onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
      className={`w-full md:w-auto px-10 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl transform active:scale-95 border ${
        isEditing 
          ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500" 
          : "bg-white text-slate-950 border-white hover:bg-slate-200"
      }`}
    >
      {isEditing ? "Save Profile" : "Edit Profile"}
    </button>
  </div>
</div>

          <div className="bg-white rounded-b-3xl shadow-2xl border-x border-b border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-10 space-y-12">
              
              {/* Profile Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Column 1: Identity & Contact */}
                <div className="space-y-10">
                  <Section title="Legal Identity">
                    <DataRow label="GST Number" name="gstNumber" value={profile.gstNumber} isEditing={isEditing} onChange={handleChange} placeholder="23XXXXX..." />
                    <DataRow label="PAN Number" name="panNumber" value={profile.panNumber} isEditing={isEditing} onChange={handleChange} />
                    <DataRow label="Business Type" name="businessType" value={profile.businessType} isEditing={isEditing} onChange={handleChange} type="select" options={["Proprietor", "Partnership", "Private Limited", "LLP"]} />
                  </Section>

                  <Section title="Communication">
                    <DataRow label="Phone Number" name="contact.phone" value={profile.contact.phone} isEditing={isEditing} onChange={handleChange} />
                    <DataRow label="Email Address" name="contact.email" value={profile.contact.email} isEditing={isEditing} onChange={handleChange} />
                    <DataRow label="Website" name="contact.website" value={profile.contact.website} isEditing={isEditing} onChange={handleChange} />
                  </Section>
                </div>

                {/* Column 2: Location & Bank */}
                <div className="space-y-10">
                  <Section title="Operational Address">
                    <DataRow label="Street" name="address.line1" value={profile.address.line1} isEditing={isEditing} onChange={handleChange} />
                    <div className="grid grid-cols-2 gap-4">
                      <DataRow label="City" name="address.city" value={profile.address.city} isEditing={isEditing} onChange={handleChange} />
                      <DataRow label="State" name="address.state" value={profile.address.state} isEditing={isEditing} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <DataRow label="Pincode" name="address.pincode" value={profile.address.pincode} isEditing={isEditing} onChange={handleChange} />
                      <DataRow label="Country" name="address.country" value={profile.address.country} isEditing={isEditing} onChange={handleChange} />
                    </div>
                  </Section>

                  <Section title="Banking Settlement">
                    <DataRow label="Bank Name" name="bank.bankName" value={profile.bank.bankName} isEditing={isEditing} onChange={handleChange} />
                    <DataRow label="Account Number" name="bank.accountNumber" value={profile.bank.accountNumber} isEditing={isEditing} onChange={handleChange} />
                    <DataRow label="IFSC Code" name="bank.ifsc" value={profile.bank.ifsc} isEditing={isEditing} onChange={handleChange} />
                  </Section>
                </div>
              </div>

              {/* Invoice Bottom Section */}
              <div className="pt-10 border-t border-slate-100">
                <Section title="Invoice Settings">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DataRow label="Invoice Prefix" name="invoiceSettings.invoicePrefix" value={profile.invoiceSettings.invoicePrefix} isEditing={isEditing} onChange={handleChange} />
                    <DataRow label="Default GST Rate" name="invoiceSettings.gstPercentage" value={profile.invoiceSettings.gstPercentage + "%"} isEditing={isEditing} onChange={handleChange} type="number" />
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Terms & Conditions</label>
                       {isEditing ? (
                         <textarea 
                           name="invoiceSettings.terms"
                           value={profile.invoiceSettings.terms}
                           onChange={handleChange}
                           rows="3"
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                         />
                       ) : (
                         <p className="text-slate-700 font-semibold italic bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">{profile.invoiceSettings.terms || "No terms specified"}</p>
                       )}
                    </div>
                  </div>
                </Section>
              </div>

            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Sub-component for Section Headings
function Section({ title, children }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-6 border-b border-indigo-50 pb-2">{title}</h2>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

// Multi-mode Row Component (View/Edit)
function DataRow({ label, name, value, isEditing, onChange, type = "text", placeholder = "", options = [] }) {
  return (
    <div className="group">
      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">{label}</label>
      {isEditing ? (
        type === "select" ? (
          <select 
            name={name} 
            value={value} 
            onChange={onChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          >
            {options.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold"
          />
        )
      ) : (
        <div className="text-slate-900 font-black text-lg group-hover:text-indigo-600 transition-colors">
          {value || <span className="text-slate-300 italic font-medium">Not provided</span>}
        </div>
      )}
    </div>
  );
}