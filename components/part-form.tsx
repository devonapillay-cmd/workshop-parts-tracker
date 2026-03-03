"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PartStatus } from "@prisma/client";
import { PartItem } from "@/lib/types";

const statuses: PartStatus[] = ["NEEDED", "ORDERED", "RECEIVED"];

type PartFormData = {
  partName: string;
  quantity: number;
  status: PartStatus;
  supplier: string;
  jobRef: string;
  customerName: string;
  priceEstimate: string;
  notes: string;
};

const emptyForm: PartFormData = {
  partName: "",
  quantity: 1,
  status: "NEEDED",
  supplier: "",
  jobRef: "",
  customerName: "",
  priceEstimate: "",
  notes: "",
};

function toFormData(part?: PartItem): PartFormData {
  if (!part) return emptyForm;
  return {
    partName: part.partName,
    quantity: part.quantity,
    status: part.status,
    supplier: part.supplier ?? "",
    jobRef: part.jobRef ?? "",
    customerName: part.customerName ?? "",
    priceEstimate: part.priceEstimate ?? "",
    notes: part.notes ?? "",
  };
}

export function PartForm({ part }: { part?: PartItem }) {
  const router = useRouter();
  const [form, setForm] = useState<PartFormData>(toFormData(part));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const response = await fetch(part ? `/api/parts/${part.id}` : "/api/parts", {
      method: part ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError("Could not save part. Check required fields and try again.");
      setSaving(false);
      return;
    }

    router.push("/parts");
    router.refresh();
  }

  async function onDelete() {
    if (!part) return;
    if (!window.confirm("Delete this part request?")) return;

    const response = await fetch(`/api/parts/${part.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Could not delete part.");
      return;
    }

    router.push("/parts");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
      {error ? <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Part name *</span>
        <input className="w-full rounded-lg border p-3 text-base" value={form.partName} onChange={(e) => setForm((old) => ({ ...old, partName: e.target.value }))} required />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Quantity *</span>
          <input type="number" min={1} className="w-full rounded-lg border p-3 text-base" value={form.quantity} onChange={(e) => setForm((old) => ({ ...old, quantity: Number(e.target.value) || 1 }))} required />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Status</span>
          <select className="w-full rounded-lg border p-3 text-base" value={form.status} onChange={(e) => setForm((old) => ({ ...old, status: e.target.value as PartStatus }))}>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>

      {["supplier", "jobRef", "customerName", "priceEstimate"].map((field) => (
        <label className="block" key={field}>
          <span className="mb-1 block text-sm font-medium">{field}</span>
          <input className="w-full rounded-lg border p-3 text-base" value={form[field as keyof PartFormData] as string} onChange={(e) => setForm((old) => ({ ...old, [field]: e.target.value }))} />
        </label>
      ))}

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Notes</span>
        <textarea className="w-full rounded-lg border p-3 text-base" rows={4} value={form.notes} onChange={(e) => setForm((old) => ({ ...old, notes: e.target.value }))} />
      </label>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-slate-900 p-3 text-base font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : part ? "Update Part" : "Add Part"}</button>
        <Link href="/parts" className="rounded-lg border p-3 text-base font-semibold">Cancel</Link>
      </div>

      {part ? <button type="button" onClick={onDelete} className="w-full rounded-lg bg-red-600 p-3 text-base font-semibold text-white">Delete Part Request</button> : null}
    </form>
  );
}
