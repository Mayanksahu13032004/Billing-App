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

      // ✅ Success Notification
      toast.success("Bill Created Successfully!", { id: toastId });

      // 🧹 Reset Fields
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
        
        <main className="max-w-4xl mx-auto p-4 sm:p-8">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-white tracking-tight">Create New Invoice</h2>
              <p className="text-slate-400 text-sm">Generate and save professional bills for customers</p>
            </div>

            <div className="p-6 sm:p-8">
              {/* Customer Selection */}
              <div className="mb-8 group">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Customer Information
                </label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-inner"
                  placeholder="Enter full customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              {/* Items Table Headings */}
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
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50/50 sm:bg-transparent rounded-2xl sm:rounded-none border sm:border-0 border-slate-100 items-center group transition-all">
                    <div className="col-span-6">
                      <input
                        placeholder="Item name or service"
                        className="w-full border border-slate-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-bold placeholder:text-slate-300 transition-all shadow-sm"
                        value={item.particular}
                        onChange={(e) => updateItem(i, "particular", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full border border-slate-200 bg-white rounded-xl p-3 text-center focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-black shadow-sm"
                        value={item.qty}
                        onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full border border-slate-200 bg-white rounded-xl p-3 text-center focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-black shadow-sm"
                        value={item.rate}
                        onChange={(e) => updateItem(i, "rate", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-end font-black text-slate-900 px-2 text-sm">
                      ₹{(item.qty * item.rate).toLocaleString()}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        onClick={() => removeItem(i)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-start border-t border-slate-100 pt-8 gap-6">
                <button
                  onClick={() => setItems([...items, { particular: "", qty: 1, rate: 0 }])}
                  className="group flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl font-black hover:bg-indigo-600 hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Row
                </button>

                <div className="text-right w-full sm:w-auto">
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    Grand Total
                  </div>
                  <div className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">
                      ₹{items.reduce((acc, item) => acc + (item.qty * item.rate), 0).toLocaleString()}
                  </div>
                  <button
                    onClick={submit}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 px-14 rounded-2xl shadow-xl hover:shadow-indigo-200 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
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