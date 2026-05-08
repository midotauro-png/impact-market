"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/brand/logo";

const DEMO_ACCOUNTS: Record<string, string> = {
  "admin@bahrain.bh":  "/admin",
  "vendor@bahrain.bh": "/vendor",
  "driver@bahrain.bh": "/driver",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true);
    setTimeout(() => {
      const dest = DEMO_ACCOUNTS[email.toLowerCase()];
      if (dest) {
        router.push(dest);
      } else {
        // Any other email → customer home
        router.push("/orders");
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block"><Logo /></Link>
          <h1 className="mt-5 text-2xl font-black text-ink">Sign In</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back to Impact Market</p>
        </div>

        <form onSubmit={handleLogin} className="card p-6 space-y-4">
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600 mb-1">Demo accounts (any password):</p>
            <p>🛡️ <code className="text-orange-500">admin@bahrain.bh</code> → Admin dashboard</p>
            <p>🏪 <code className="text-emerald-600">vendor@bahrain.bh</code> → Vendor dashboard</p>
            <p>🚴 <code className="text-purple-600">driver@bahrain.bh</code> → Driver app</p>
          </div>
        </form>

        <div className="mt-6 grid grid-cols-1 gap-3 text-sm">
          {[
            { role: "Admin", href: "/admin", color: "bg-navy-600", hint: "Full platform control" },
            { role: "Vendor", href: "/vendor", color: "bg-emerald-600", hint: "Manage your store" },
            { role: "Driver", href: "/driver", color: "bg-purple-600", hint: "Start delivering" },
          ].map((r) => (
            <Link key={r.role} href={r.href} className="card-hover flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className={`h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-black ${r.color}`}>{r.role[0]}</span>
                <div>
                  <p className="font-bold text-ink text-sm">{r.role} Dashboard</p>
                  <p className="text-xs text-slate-400">{r.hint}</p>
                </div>
              </div>
              <span className="text-xs text-orange-400 font-semibold">Enter →</span>
            </Link>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          New customer? <Link href="/signup" className="text-orange-400 font-semibold hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
