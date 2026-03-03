import { PartStatus } from "@prisma/client";

export const statusOrder: PartStatus[] = ["NEEDED", "ORDERED", "RECEIVED"];

export const statusLabels: Record<PartStatus | "ALL", string> = {
  ALL: "All",
  NEEDED: "Needed",
  ORDERED: "Ordered",
  RECEIVED: "Received",
};

export function advanceStatus(current: PartStatus): PartStatus {
  const index = statusOrder.indexOf(current);
  return statusOrder[Math.min(index + 1, statusOrder.length - 1)];
}
