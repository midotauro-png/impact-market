export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-orange-400 animate-pulse" />
        <p className="text-sm text-slate-400 font-semibold animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
