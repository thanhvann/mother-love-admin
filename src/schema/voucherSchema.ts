
import { z } from "zod";

export const voucherSchema = z.object({
  voucherId: z.number().optional(), 
  voucherCode: z.string().min(1, { message: "Voucher Code Required" }),
  voucherName: z.string().min(1, { message: "Voucher Name Required" }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1" }),
  quantityUse: z.coerce.number().min(1, { message: "Quantity Use must be at least 1" }),
  discount: z.coerce.number().min(0, { message: "Discount must be positive" }),
  minOrderAmount: z.coerce.number().min(0, { message: "Min Order Amount must be positive" }),
  startDate: z.string().min(1, { message: "Start Date Required" }),
  endDate: z.string().min(1, { message: "End Date Required" }),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  });
 