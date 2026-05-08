"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Store } from "lucide-react";
import Logo from "@/components/brand/logo";
import { categories } from "@/lib/mock-data";
import { ZONES } from "@/lib/zones";

export default function VendorSignupPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center space-y-5 max-w-md">
          <CheckCircle size={64} className="text-emerald-500 mx-auto" />
          <h2 className="text-3xl font-black text-ink">Application Submitted!</h2>
          <p className="text-slate-500">Your vendor application is under review. We&apos;ll contact you within 24 hours after verifying your CR number.</p>
          <Link href="/" className="btn-primary inline-flex">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/"><Logo /></Link>
          <h1 className="mt-5 text-2xl font-black text-ink flex items-center justify-center gap-2">
            <Store size={22} className="text-orange-400" /> Register Your Business
          </h1>
          <p className="text-slate-500 text-sm mt-1">Reach thousands of Bahraini customers</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1,2,3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition ${step >= s ? "bg-orange-400 text-white" : "bg-slate-200 text-slate-500"}`}>{s}</div>
              {s < 3 && <div className={`w-12 h-0.5 rounded ${step > s ? "bg-orange-400" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        <div className="card p-6 space-y-4">
          {step === 1 && (
            <>
              <h3 className="font-bold text-ink">Business Information</h3>
              <div className="form-group">
                <label className="label">Business Name (Arabic & English)</label>
                <input className="input" placeholder="e.g. مطعم البيت / Al Bait Restaurant" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label">Owner Name</label>
                  <input className="input" placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label className="label">CPR Number</label>
                  <input className="input" placeholder="9 digits" />
                </div>
              </div>
              <div className="form-group">
                <label className="label">CR Number (if registered)</label>
                <input className="input" placeholder="CR-XXXXX (optional for home businesses)" />
              </div>
              <div className="form-group">
                <label className="label">Category</label>
                <select className="input">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <button className="btn-primary w-full justify-center" onClick={() => setStep(2)}>Next →</button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="font-bold text-ink">Location & Contact</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label">Phone</label>
                  <input className="input" placeholder="+973 3X XX XXXX" />
                </div>
                <div className="form-group">
                  <label className="label">WhatsApp</label>
                  <input className="input" placeholder="+973 3X XX XXXX" />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="business@example.com" />
              </div>
              <div className="form-group">
                <label className="label">Zone / Governorate</label>
                <select className="input">
                  {ZONES.filter((z) => z.is_active).map((z) => (
                    <option key={z.id} value={z.id}>{z.name} — {z.cities[0]}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Full Address</label>
                <textarea className="input" rows={2} placeholder="Block, Road, Building, Area" />
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary flex-1 justify-center" onClick={() => setStep(3)}>Next →</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="font-bold text-ink">Store Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label">Opening Time</label>
                  <input type="time" className="input" defaultValue="08:00" />
                </div>
                <div className="form-group">
                  <label className="label">Closing Time</label>
                  <input type="time" className="input" defaultValue="22:00" />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Delivery Radius (km)</label>
                <input type="number" className="input" defaultValue={8} min={1} max={25} />
              </div>
              <div className="form-group">
                <label className="label">Logo URL</label>
                <input className="input" placeholder="https://… or upload via admin" />
              </div>
              <div className="form-group">
                <label className="label">Cover Photo URL</label>
                <input className="input" placeholder="https://…" />
              </div>
              <div className="form-group">
                <label className="label">Bank IBAN (for payouts)</label>
                <input className="input" placeholder="BH00BANK0000000000000000" />
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary flex-1 justify-center" onClick={() => setSubmitted(true)}>
                  Submit Application
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
