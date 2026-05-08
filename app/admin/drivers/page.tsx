"use client";
import { useState } from "react";
import StatusBadge from "@/components/ui/status-badge";
import { drivers as initialDrivers } from "@/lib/mock-data";
import { fmtBHD } from "@/lib/utils";
import { zoneById } from "@/lib/zones";
import type { Driver } from "@/lib/types";

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers);

  function setStatus(id: string, status: Driver["status"]) {
    setDrivers((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-ink">Drivers ({drivers.length})</h2>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>Driver</th><th>Contact</th><th>Vehicle</th>
            <th>Zone</th><th>Online</th><th>Deliveries</th>
            <th>Wallet</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {drivers.map((d) => {
              const zone = zoneById(d.active_zone_id);
              return (
                <tr key={d.id}>
                  <td>
                    <p className="font-semibold text-ink text-sm">{d.full_name}</p>
                    <p className="text-xs text-slate-400">CPR: {d.cpr}</p>
                  </td>
                  <td className="text-xs text-slate-500">
                    <p>{d.email}</p><p>{d.phone}</p>
                  </td>
                  <td className="text-xs">
                    <p className="font-semibold capitalize">{d.vehicle_type}</p>
                    <p className="text-slate-400">{d.vehicle_plate}</p>
                  </td>
                  <td className="text-xs text-slate-600">{zone?.name ?? d.active_zone_id}</td>
                  <td>
                    <span className={`badge text-[10px] ${d.is_online ? "badge-green" : "badge-gray"}`}>
                      {d.is_online ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="text-sm font-semibold">{d.total_deliveries}</td>
                  <td className="text-sm font-semibold text-emerald-600">{fmtBHD(d.wallet_fils)}</td>
                  <td><StatusBadge status={d.status} type="approval" /></td>
                  <td>
                    <div className="flex gap-1.5 flex-wrap">
                      {d.status !== "approved" && (
                        <button onClick={() => setStatus(d.id, "approved")} className="btn-primary btn-sm">Approve</button>
                      )}
                      {d.status === "approved" && (
                        <button onClick={() => setStatus(d.id, "suspended")} className="btn-ghost btn-sm text-red-500">Suspend</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
