import { PartsList } from "@/components/parts-list";
import { prisma } from "@/lib/prisma";
import { PartItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PartsPage() {
  const parts = await prisma.partRequest.findMany({ orderBy: { createdAt: "desc" } });
  const safeParts = JSON.parse(JSON.stringify(parts)) as PartItem[];

  return <PartsList initialParts={safeParts} />;
}
