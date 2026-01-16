"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function CreateBill() {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([
    { particular: "", qty: 1, rate: 0 },
  ]);

  function updateItem(i, field, value) {
    const copy = [...items];
    copy[i][field] = value;
    setItems(copy);
  }

  function removeItem(index) {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    } else {
      toast.error("At least one item is required");
    }
  }

  async function submit() {
    if (!customerName.trim()) {
      return toast.error("Please enter customer name");
    }

    const toastId = toast.loading("Creating bill...");

    try {
      await api("/api/bills", {
        method: "POST",
        body: JSON.stringify({ customerName, items }),
      });

      toast.success("Bill Created Successfully!", { id: toastId });
      setCustomerName("");
      setItems([{ particular: "", qty: 1, rate: 0 }]);
    } catch (error) {
      toast.error("Failed to create bill", { id: toastId });
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        
        <main className="max-w-4xl mx-auto p-3 sm:p-8">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Create New Invoice</h2>
              <p className="text-slate-400 text-xs sm:text-sm">Generate professional bills for customers</p>
            </div>

            <div className="p-4 sm:p-8">
              {/* Customer Selection */}
              <div className="mb-6 sm:mb-8 group">
                <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Customer Information
                </label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-inner"
                  placeholder="Enter full customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              {/* Items Table Headings - Hidden on Mobile */}
              <div className="hidden sm:grid grid-cols-12 gap-4 mb-3 px-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <div className="col-span-6">Description / Particular</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-1 text-right">Amount</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item, i) => (
                  <div key={i} className="relative grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50/50 sm:bg-transparent rounded-2xl sm:rounded-none border sm:border-b sm:border-t-0 sm:border-x-0 border-slate-200 items-center transition-all">
                    
                    {/* Item Name */}
                    <div className="col-span-1 sm:col-span-6">
                      <label className="sm:hidden block text-[9px] font-black text-slate-400 uppercase mb-1">Description</label>
                      <input
                        placeholder="Item name or service"
                        className="w-full border border-slate-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-bold placeholder:text-slate-300 transition-all shadow-sm"
                        value={item.particular}
                        onChange={(e) => updateItem(i, "particular", e.target.value)}
                      />
                    </div>

                    {/* Qty & Rate grouped on mobile */}
                    <div className="col-span-1 sm:col-span-4 grid grid-cols-2 gap-3">
                      <div>
                        <label className="sm:hidden block text-[9px] font-black text-slate-400 uppercase mb-1">Qty</label>
                        <input
                          type="number"
                          className="w-full border border-slate-200 bg-white rounded-xl p-3 text-center focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-black shadow-sm"
                          value={item.qty}
                          onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="sm:hidden block text-[9px] font-black text-slate-400 uppercase mb-1">Rate</label>
                        <input
                          type="number"
                          className="w-full border border-slate-200 bg-white rounded-xl p-3 text-center focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-black shadow-sm"
                          value={item.rate}
                          onChange={(e) => updateItem(i, "rate", Number(e.target.value))}
                        />
                      </div>
                    </div>

                    {/* Amount & Remove Button */}
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-none">
                      <div className="flex flex-col sm:items-end">
                        <label className="sm:hidden block text-[9px] font-black text-slate-400 uppercase">Subtotal</label>
                        <span className="font-black text-slate-900 text-base sm:text-sm">
                          ₹{(item.qty * item.rate).toLocaleString()}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(i)}
                        className="p-2.5 bg-red-50 sm:bg-transparent text-red-500 sm:text-slate-300 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center sm:items-start border-t border-slate-100 pt-8 gap-8">
                <button
                  onClick={() => setItems([...items, { particular: "", qty: 1, rate: 0 }])}
                  className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-black hover:bg-indigo-600 hover:text-white transition-all uppercase text-xs tracking-widest shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Row
                </button>

                <div className="text-center sm:text-right w-full sm:w-auto">
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    Grand Total
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 sm:mb-8 tracking-tighter">
                      ₹{items.reduce((acc, item) => acc + (item.qty * item.rate), 0).toLocaleString()}
                  </div>
                  <button
                    onClick={submit}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 sm:py-5 px-10 sm:px-14 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
                  >
                    Confirm & Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}