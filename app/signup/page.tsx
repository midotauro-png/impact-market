"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Logo from "@/components/brand/logo";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ first: "", last: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value })); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.first || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 700);
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center space-y-5 max-w-md">
          <CheckCircle size={56} className="text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-black text-ink">Account Created!</h2>
          <p className="text-slate-500">Welcome to Impact Market. Start browsing local vendors.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push("/stores")} className="btn-primary">Browse Stores</button>
            <button onClick={() => router.push("/login")} className="btn-ghost">Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/"><Logo /></Link>
          <h1 className="mt-5 text-2xl font-black text-ink">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Order from local Bahraini vendors</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="label">First Name *</label>
              <input className="input" placeholder="Ahmed" value={form.first} onChange={set("first")} />
            </div>
            <div className="form-group">
              <label className="label">Last Name</label>
              <input className="input" placeholder="Al Dosari" value={form.last} onChange={set("last")} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Phone (WhatsApp)</label>
            <input className="input" type="tel" placeholder="+973 3X XX XXXX" value={form.phone} onChange={set("phone")} />
          </div>
          <div className="form-group">
            <label className="label">Email *</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
          </div>
          <div className="form-group">
            <label className="label">Password *</label>
            <input className="input" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={set("password")} />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account? <Link href="/login" className="text-orange-400 font-semibold hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-sm text-slate-500 mt-2">
          Want to sell? <Link href="/vendor/signup" className="text-emerald-600 font-semibold hover:underline">Register as Vendor</Link>
        </p>
      </div>
    </div>
  );
}
