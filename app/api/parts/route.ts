import { NextRequest, NextResponse } from "next/server";
import { PartStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { partRequestSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const query = searchParams.get("query")?.trim();

  const where = {
    ...(status && status !== "ALL" && Object.values(PartStatus).includes(status as PartStatus)
      ? { status: status as PartStatus }
      : {}),
    ...(query
      ? {
          OR: [
            { partName: { contains: query } },
            { jobRef: { contains: query } },
            { customerName: { contains: query } },
          ],
        }
      : {}),
  };

  const parts = await prisma.partRequest.findMany({
    where,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(parts);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const parsed = partRequestSchema.safeParse(data);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const created = await prisma.partRequest.create({
    data: {
      ...parsed.data,
      priceEstimate:
        parsed.data.priceEstimate === null ? null : parsed.data.priceEstimate.toString(),
    },
  });

  return NextResponse.json(created, { status: 201 });
}
