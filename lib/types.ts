import { PartStatus } from "@prisma/client";

export type PartItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  partName: string;
  quantity: number;
  status: PartStatus;
  supplier: string | null;
  jobRef: string | null;
  customerName: string | null;
  priceEstimate: string | null;
  notes: string | null;
};
