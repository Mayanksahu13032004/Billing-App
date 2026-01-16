"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Unauthorized or failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
      toast.error("Could not refresh user directory");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function createUser(e) {
    e.preventDefault();
    setCreating(true);
    setError("");
    const loadId = toast.loading("Creating user account...");

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create user");
      }
      setNewUsername("");
      setNewPassword("");
      toast.success("User created successfully!", { id: loadId });
      fetchUsers();
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { id: loadId });
    } finally {
      setCreating(false);
    }
  }

  async function updateUser(e) {
    e.preventDefault();
    if (!editingUser) return;
    setUpdating(true);
    setError("");
    const loadId = toast.loading("Updating user...");

    try {
      const res = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editUsername || undefined,
          password: editPassword || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update user");
      }
      setEditingUser(null);
      setEditUsername("");
      setEditPassword("");
      toast.success("Profile updated!", { id: loadId });
      fetchUsers();
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { id: loadId });
    } finally {
      setUpdating(false);
    }
  }

  async function deleteUser(userId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const loadId = toast.loading("Deleting user...");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete user");
      }

      toast.success("User removed from system", { id: loadId });
      fetchUsers();
    } catch (err) {
      toast.error(err.message, { id: loadId });
      setError(err.message);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out successfully");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      toast.error("Logout failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Management
            </h2>
            <p className="text-slate-500 mt-1">Configure staff accounts and permissions.</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-white text-red-600 border border-red-100 px-6 py-2.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: FORMS */}
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={createUser} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-6 text-slate-900 flex items-center gap-2">
                <span className="bg-slate-100 p-1.5 rounded-lg text-slate-600 italic">Add User</span>
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUsername}
                  required
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newPassword}
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
                >
                  {creating ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>

            {editingUser && (
              <form onSubmit={updateUser} className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-200 animate-pulse-once">
                <h3 className="text-lg font-bold mb-4 text-indigo-900">Edit: {editingUser.username}</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full bg-white border border-indigo-200 p-3 rounded-xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="password"
                    placeholder="New Password (optional)"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full bg-white border border-indigo-200 p-3 rounded-xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Save</button>
                    <button type="button" onClick={() => setEditingUser(null)} className="flex-1 bg-white text-slate-500 py-3 rounded-xl font-bold border border-slate-200">Cancel</button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: TABLE */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">User Directory</h3>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{users.length} Users</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">{user.username.charAt(0).toUpperCase()}</div>
                            <span className="font-bold text-slate-900">{user.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right space-x-2">
                          <button
                            onClick={() => { setEditingUser(user); setEditUsername(user.username); setEditPassword(""); }}
                            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-black hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-black hover:bg-red-600 hover:text-white transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}