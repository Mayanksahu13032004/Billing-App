"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [profile, setProfile] = useState({
    businessName: "",
    ownerName: "",
    businessType: "Proprietor",
    gstNumber: "",
    panNumber: "",
    logo: "", 
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
        if (data) {
          setProfile((prev) => ({ ...prev, ...data }));
          if (data.logo) setLogoPreview(data.logo);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

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
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (key === "logo") return;
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setLogoPreview(updatedProfile.logo || null);
      setLogoFile(null);
      setIsEditing(false);
      toast.success("Profile updated successfully!", { id: toastId });
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
          <div className="relative bg-slate-950 rounded-t-3xl p-6 sm:px-10 sm:py-8 overflow-hidden shadow-2xl border-b border-white/5">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
              
              {/* Logo Branding Section */}
            {/* Logo Branding Section */}
<div className="relative group flex-shrink-0">
  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/10 overflow-hidden bg-slate-900 shadow-2xl flex items-center justify-center relative">
    {logoPreview ? (
      <img src={logoPreview} alt="Business Logo" className="w-full h-full object-cover" />
    ) : (
      <span className="text-white/20 text-3xl font-black">{profile.businessName?.charAt(0)}</span>
    )}
    
    {isEditing && (
      <label htmlFor="logoUpload" className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleLogoChange} 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          id="logoUpload" 
          /* REMOVED capture="environment" to allow gallery access */
        />
      </label>
    )}
  </div>
  {/* Visual Glow behind logo */}
  <div className="absolute -inset-1 bg-indigo-500/20 rounded-full blur-xl pointer-events-none"></div>
</div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-black tracking-widest rounded-full uppercase">
                    Verified Business
                  </span>
                </div>
                
                {/* NEW: Company Name Input Field */}
                {isEditing ? (
                  <div className="mb-2">
                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Company / Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={profile.businessName}
                      onChange={handleChange}
                      placeholder="Enter Business Name"
                      className="w-full max-w-md bg-white/10 border border-white/20 rounded-xl p-3 text-white font-black text-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-white/20"
                    />
                  </div>
                ) : (
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic leading-tight mb-1">
                    {profile.businessName || "Your Company Name"}
                  </h1>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                   {isEditing ? (
                      <input
                        type="text"
                        name="ownerName"
                        value={profile.ownerName}
                        onChange={handleChange}
                        placeholder="Owner Name"
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-xs outline-none focus:ring-1 focus:ring-indigo-400"
                      />
                   ) : (
                      <p className="text-slate-100 text-xs font-bold opacity-80 uppercase tracking-wide">
                        {profile.ownerName} <span className="mx-2 text-indigo-500">|</span> {profile.businessType}
                      </p>
                   )}
                </div>
              </div>

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

          {/* Rest of the form remains the same */}
          <div className="bg-white rounded-b-3xl shadow-2xl border-x border-b border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function Section({ title, children }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-6 border-b border-indigo-50 pb-2">{title}</h2>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

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
            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
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
            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold shadow-inner"
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