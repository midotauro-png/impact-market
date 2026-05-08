import Link from "next/link";
import Logo from "@/components/brand/logo";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/"><Logo /></Link>
          <h1 className="mt-5 text-2xl font-black text-ink">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Order from local Bahraini vendors</p>
        </div>

        <div className="card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="label">First Name</label>
              <input className="input" placeholder="Ahmed" />
            </div>
            <div className="form-group">
              <label className="label">Last Name</label>
              <input className="input" placeholder="Al Dosari" />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Phone (WhatsApp)</label>
            <input className="input" type="tel" placeholder="+973 3X XX XXXX" />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Minimum 8 characters" />
          </div>
          <button className="btn-primary w-full justify-center">Create Account</button>
        </div>

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
