import Link from "next/link";
import Navbar from "@/components/brand/navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 gap-5">
        <p className="text-8xl font-black text-slate-100 select-none">404</p>
        <div className="-mt-8">
          <h1 className="text-2xl font-black text-ink">Page not found</h1>
          <p className="text-slate-500 mt-2">This page doesn&apos;t exist or has been moved.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/stores" className="btn-ghost">Browse Stores</Link>
        </div>
      </div>
    </>
  );
}
