import { PartForm } from "@/components/part-form";

export default function NewPartPage() {
  return (
    <main className="mx-auto max-w-xl space-y-4 px-3 py-4">
      <h1 className="text-2xl font-bold">Add Part Request</h1>
      <PartForm />
    </main>
  );
}
