import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { advanceStatus } from "@/lib/part-status";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const part = await prisma.partRequest.findUnique({ where: { id: params.id } });

  if (!part) {
    return NextResponse.json({ error: "Part not found" }, { status: 404 });
  }

  const updated = await prisma.partRequest.update({
    where: { id: params.id },
    data: { status: advanceStatus(part.status) },
  });

  return NextResponse.json(updated);
}
