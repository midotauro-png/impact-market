"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Truck } from "lucide-react";
import Logo from "@/components/brand/logo";
import { ZONES } from "@/lib/zones";

export default function DriverSignupPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center space-y-5 max-w-md">
          <CheckCircle size={64} className="text-emerald-500 mx-auto" />
          <h2 className="text-3xl font-black text-ink">Application Received!</h2>
          <p className="text-slate-500">We&apos;ll review your documents and contact you within 48 hours to activate your driver account.</p>
          <Link href="/" className="btn-primary inline-flex">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link href="/"><Logo /></Link>
          <h1 className="mt-5 text-2xl font-black text-ink flex items-center justify-center gap-2">
            <Truck size={22} className="text-purple-500" /> Become a Driver
          </h1>
          <p className="text-slate-500 text-sm mt-1">Deliver for Bahrain Marketplace and earn daily</p>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-ink">Personal Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group col-span-2">
              <label className="label">Full Name (as on CPR)</label>
              <input className="input" placeholder="Ahmed Mohammed Al Dosari" />
            </div>
            <div className="form-group">
              <label className="label">CPR Number</label>
              <input className="input" placeholder="9 digits" maxLength={9} />
            </div>
            <div className="form-group">
              <label className="label">Phone (WhatsApp)</label>
              <input className="input" placeholder="+973 3X XX XXXX" />
            </div>
            <div className="form-group col-span-2">
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="you@example.com" />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-ink mb-3">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Vehicle Type</label>
                <select className="input">
                  <option value="bike">Bike / Motorcycle</option>
                  <option value="scooter">Scooter</option>
                  <option value="car">Car</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Plate Number</label>
                <input className="input" placeholder="BH-1234" />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-ink mb-3">Preferred Delivery Zone</h3>
            <div className="form-group">
              <label className="label">Primary Zone</label>
              <select className="input">
                {ZONES.filter((z) => z.is_active).map((z) => (
                  <option key={z.id} value={z.id}>{z.name} — {z.cities[0]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-xs text-purple-700">
            <strong>Documents required:</strong> CPR copy, driving license, vehicle registration, vehicle photo. Upload after account activation.
          </div>

          <button className="btn-primary w-full justify-center" onClick={() => setSubmitted(true)}>
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}
