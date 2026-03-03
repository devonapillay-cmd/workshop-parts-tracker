import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { partRequestSchema } from "@/lib/validation";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const part = await prisma.partRequest.findUnique({ where: { id: params.id } });

  if (!part) {
    return NextResponse.json({ error: "Part not found" }, { status: 404 });
  }

  return NextResponse.json(part);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json();
  const parsed = partRequestSchema.safeParse(data);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.partRequest.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      priceEstimate:
        parsed.data.priceEstimate === null ? null : parsed.data.priceEstimate.toString(),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.partRequest.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
