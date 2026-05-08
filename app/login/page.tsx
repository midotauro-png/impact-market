import Link from "next/link";
import Logo from "@/components/brand/logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block"><Logo /></Link>
          <h1 className="mt-5 text-2xl font-black text-ink">Sign In</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back to Bahrain Marketplace</p>
        </div>

        <div className="card p-6 space-y-4">
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <button className="btn-primary w-full justify-center">Sign In</button>
          <p className="text-center text-xs text-slate-500">
            Demo credentials: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-orange-500">admin@bahrain.bh</code>
          </p>
        </div>

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
