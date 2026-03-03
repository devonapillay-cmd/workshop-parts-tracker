"use client";

import Link from "next/link";
import { PartStatus } from "@prisma/client";
import { useMemo, useState } from "react";
import { statusLabels } from "@/lib/part-status";
import { PartItem } from "@/lib/types";

type Tab = PartStatus | "ALL";
const tabs: Tab[] = ["NEEDED", "ORDERED", "RECEIVED", "ALL"];

export function PartsList({ initialParts }: { initialParts: PartItem[] }) {
  const [parts, setParts] = useState(initialParts);
  const [activeTab, setActiveTab] = useState<Tab>("NEEDED");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return parts.filter((part) => {
      const matchesTab = activeTab === "ALL" || part.status === activeTab;
      const matchesSearch = !term || [part.partName, part.jobRef ?? "", part.customerName ?? ""].join(" ").toLowerCase().includes(term);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, parts, search]);

  async function updateStatus(id: string, status: PartStatus) {
    const part = parts.find((p) => p.id === id);
    if (!part) return;

    const response = await fetch(`/api/parts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...part, status }),
    });

    if (!response.ok) return;
    const updated = (await response.json()) as PartItem;
    setParts((old) => old.map((item) => (item.id === id ? updated : item)));
  }

  async function advance(id: string) {
    const response = await fetch(`/api/parts/${id}/advance`, { method: "POST" });
    if (!response.ok) return;
    const updated = (await response.json()) as PartItem;
    setParts((old) => old.map((item) => (item.id === id ? updated : item)));
  }

  return (
    <main className="mx-auto max-w-xl space-y-4 px-3 pb-24 pt-3">
      <h1 className="text-2xl font-bold">Parts Tracker</h1>
      <input placeholder="Search part, job ref, customer" className="w-full rounded-lg border p-3 text-base" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === tab ? "bg-slate-900 text-white" : "bg-white"}`}>
            {statusLabels[tab]}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.map((part) => (
          <li key={part.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{part.partName}</p>
                <p className="text-sm text-slate-600">Qty: {part.quantity}</p>
                {part.jobRef ? <p className="text-sm text-slate-600">Job: {part.jobRef}</p> : null}
                {part.customerName ? <p className="text-sm text-slate-600">Customer: {part.customerName}</p> : null}
              </div>
              <Link href={`/parts/${part.id}`} className="rounded-lg border px-3 py-2 text-sm font-medium">Edit</Link>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => advance(part.id)} className="rounded-lg bg-emerald-600 p-3 text-sm font-semibold text-white">
                Next Status
              </button>
              <select className="rounded-lg border p-3 text-sm" value={part.status} onChange={(e) => updateStatus(part.id, e.target.value as PartStatus)}>
                {(["NEEDED", "ORDERED", "RECEIVED"] as PartStatus[]).map((status) => (
                  <option key={status} value={status}>{statusLabels[status]}</option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? <p className="rounded-xl bg-white p-4 text-sm text-slate-600">No parts match your filter/search yet.</p> : null}
      <Link href="/parts/new" className="fixed bottom-4 right-4 rounded-full bg-slate-900 px-5 py-4 text-base font-bold text-white shadow-lg">+ Add Part</Link>
    </main>
  );
}
