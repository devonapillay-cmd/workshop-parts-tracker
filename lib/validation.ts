import { PartStatus } from "@prisma/client";
import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable()
  .optional();

export const partRequestSchema = z.object({
  partName: z.string().trim().min(1, "Part name is required").max(200),
  quantity: z.coerce.number().int().min(1).max(9999).default(1),
  status: z.nativeEnum(PartStatus).default(PartStatus.NEEDED),
  supplier: optionalString,
  jobRef: optionalString,
  customerName: optionalString,
  priceEstimate: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === "") {
        return null;
      }
      const parsed = typeof val === "number" ? val : Number(val);
      return Number.isFinite(parsed) ? parsed : null;
    }),
  notes: optionalString,
});

export type PartRequestInput = z.infer<typeof partRequestSchema>;
