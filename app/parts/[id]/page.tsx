import { notFound } from "next/navigation";
import { PartForm } from "@/components/part-form";
import { prisma } from "@/lib/prisma";
import { PartItem } from "@/lib/types";

export default async function PartDetailPage({ params }: { params: { id: string } }) {
  const part = await prisma.partRequest.findUnique({ where: { id: params.id } });

  if (!part) notFound();

  const safePart = JSON.parse(JSON.stringify(part)) as PartItem;

  return (
    <main className="mx-auto max-w-xl space-y-4 px-3 py-4">
      <h1 className="text-2xl font-bold">Edit Part</h1>
      <PartForm part={safePart} />
    </main>
  );
}
