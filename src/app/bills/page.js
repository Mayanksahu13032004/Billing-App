"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [billNo, setBillNo] = useState("");
  const [customer, setCustomer] = useState("");

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchBills = useCallback(async (isManualSearch = false) => {
    setLoading(true);
    let url = "/api/bills";

    const params = new URLSearchParams();
    if (billNo) params.append("billNo", billNo);
    if (customer) params.append("customer", customer);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBills(data);
      
      // Only show success toast if the user clicked the "Search" button
      if (isManualSearch && queryString) {
        toast.success(`Found ${data.length} records`);
      }
    } catch (err) {
      console.error("Failed to fetch bills", err);
      toast.error("Error loading bills");
    } finally {
      setLoading(false);
    }
  }, [billNo, customer]);

  // Trigger search automatically when billNo or customer changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBills();
    }, 300); // 300ms debounce to prevent hitting the API on every single keystroke

    return () => clearTimeout(delayDebounceFn);
  }, [billNo, customer, fetchBills]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Toaster position="top-center" />
        <Navbar />

        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Invoices
              </h2>
              <p className="text-slate-500 font-medium">Manage and track customer transactions</p>
            </div>
          </div>

          {/* 🔍 DYNAMIC SEARCH BAR */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex-1 min-w-[200px] group">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Bill Number
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1001"
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold placeholder:text-slate-300"
                />
              </div>

              <div className="flex-[2] min-w-[250px] group">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="Search name..."
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-bold placeholder:text-slate-300"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setBillNo("");
                    setCustomer("");
                    toast.success("Filters reset");
                  }}
                  className="bg-white text-slate-500 border border-slate-200 px-6 py-3 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all active:scale-95"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* 📄 TABLE AREA */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning Directory...</p>
              </div>
            ) : bills.length === 0 ? (
              <div className="p-20 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Bill No</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Customer</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Total Amount</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {bills.map((bill) => (
                      <tr key={bill._id} className="hover:bg-indigo-50/40 transition-colors group">
                        <td className="px-8 py-5 font-mono text-sm text-indigo-600 font-black">
                          {bill.billNo}
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{bill.customerName}</div>
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-500 font-bold">
                          {new Date(bill.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-black text-slate-900">
                            ₹{bill.grandTotal.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <a
                            href={`/api/bills/${bill._id}/pdf`}
                            target="_blank"
                            className="inline-flex items-center gap-2 bg-slate-100 text-slate-900 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all transform active:scale-95"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}