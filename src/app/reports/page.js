"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/reports/monthly", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error(err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="max-w-7xl mx-auto p-6 sm:p-8">
          <header className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Financial Reports
            </h2>
            <p className="text-slate-500 mt-1">Review your business performance and revenue metrics.</p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Compiling your data...</p>
            </div>
          ) : !report ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-red-100 shadow-sm">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Data Fetching Failed</h3>
              <p className="text-slate-500 mt-1">We couldn't load the reports at this time. Please try again later.</p>
            </div>
          ) : (
            <>
              {/* SUMMARY CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Bills Issued</p>
                  <p className="text-4xl font-black text-slate-900 mt-2">{report.totalBills.toLocaleString()}</p>
                  <div className="mt-4 inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
                    Lifetime volume
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Gross Revenue</p>
                  <p className="text-4xl font-black text-slate-900 mt-2">
                    ₹{report.totalRevenue.toLocaleString()}
                  </p>
                  <div className="mt-4 inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    INR Currency
                  </div>
                </div>
              </div>

              {/* MONTHLY REPORT TABLE */}
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                   <h3 className="font-bold text-slate-800 tracking-tight text-lg">Monthly Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-8 py-4 border-b">Month</th>
                        <th className="px-8 py-4 border-b text-center">Invoice Count</th>
                        <th className="px-8 py-4 border-b text-right">Revenue (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {report.monthly.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-8 py-5 font-semibold text-slate-700">{row.month}</td>
                          <td className="px-8 py-5 text-center">
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {row.billCount}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right font-mono text-sm font-bold text-slate-900">
                            {row.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50/50 border-t border-slate-200">
                      <tr className="text-slate-900 font-bold">
                        <td className="px-8 py-5">Summary Total</td>
                        <td className="px-8 py-5 text-center">{report.totalBills}</td>
                        <td className="px-8 py-5 text-right text-indigo-600">
                          ₹{report.totalRevenue.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}