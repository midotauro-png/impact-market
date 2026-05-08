import { Star } from "lucide-react";
import { reviews } from "@/lib/mock-data";
import { relTime } from "@/lib/utils";

const DEMO_VENDOR_ID = "v-burhan";

export default function VendorReviewsPage() {
  const myReviews = reviews.filter((r) => r.vendor_id === DEMO_VENDOR_ID);
  const avg = myReviews.length
    ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length
    : 0;

  function Stars({ rating }: { rating: number }) {
    return (
      <span className="flex gap-0.5">
        {[1,2,3,4,5].map((i) => (
          <Star key={i} size={13} className={i <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
        ))}
      </span>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className="text-xl font-black text-ink">Reviews</h2>

      {/* Summary */}
      <div className="card p-5 flex items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-black text-ink">{avg.toFixed(1)}</p>
          <Stars rating={Math.round(avg)} />
          <p className="text-xs text-slate-400 mt-1">{myReviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5,4,3,2,1].map((star) => {
            const count = myReviews.filter((r) => r.rating === star).length;
            const pct = myReviews.length ? (count / myReviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-slate-500">{star}</span>
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-4 text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      {myReviews.length === 0 ? (
        <div className="card p-10 text-center text-slate-400">No reviews yet.</div>
      ) : (
        <div className="space-y-3">
          {myReviews.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-ink text-sm">{r.customer_name}</p>
                  <Stars rating={r.rating} />
                </div>
                <span className="text-xs text-slate-400">{relTime(r.created_at)}</span>
              </div>
              <p className="text-sm text-slate-600">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
