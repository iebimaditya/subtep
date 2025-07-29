import z from "zod/v4";

export const accessTokenSchema = z.string();

export const nationalityIdSchema = z.string().regex(/^\d{16}$/, {
  message:
    "Enter your 16‑digit National ID number—digits only, no spaces or letters.",
});

export const customerTypeSchema = z.enum([
  "Rumah Tangga",
  "Usaha Mikro",
  "Pengecer",
]);

export const customerSchema = z.object({
  nationalityId: nationalityIdSchema,
  familyId: z.string(),
  encryptedFamilyId: z.string(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  types: z.array(customerTypeSchema),
});

export const quotaSchema = z.number();

export const customerWithQuotaSchema = customerSchema
  .omit({ types: true })
  .extend({ type: customerTypeSchema, quota: quotaSchema });

export const transactionSChema = z.object({
  id: z.string(),
  nationalityId: nationalityIdSchema,
  name: z.string(),
  type: customerTypeSchema,
  total: quotaSchema,
});

export const nationalityIdsFileSchema = z.array(nationalityIdSchema);
export const customersWithQuotaFileSchema = z.array(customerWithQuotaSchema);

export const loginRequestSchema = z.object({
  identifier: z.union([
    z.email({
      error: "Please enter a valid email address—like name@example.com.",
    }),
    z.string().regex(/^((?:\+62|62)|0)8[1-9][0-9]{6,10}$/, {
      error:
        "Must be a valid Indonesian mobile phone number, e.g. 081234567890 or +6281234567890.",
    }),
  ]),
  pin: z.string().regex(/^\d{6}$/, {
    error: "Please enter exactly six digits (0–9), like 123456.",
  }),
});

export const verifyCustomerRequestSchema = z.object({
  nationalityId: nationalityIdSchema,
});

export const getQuotaRequestSchema = z.object({
  nationalityId: nationalityIdSchema,
  encryptedFamilyId: z.string(),
  customerType: customerTypeSchema,
});

export const getTransactionsRequestSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

export const verifyCustomerResponseSchema = z.object({
  customer: customerSchema,
});

export const getQuotaResponseSchema = z.object({
  nationalityId: nationalityIdSchema,
  customerType: customerTypeSchema,
  quota: quotaSchema,
});

export type CustomerType = z.infer<typeof customerTypeSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type CustomerWithQuota = z.infer<typeof customerWithQuotaSchema>;
export type Transaction = z.infer<typeof transactionSChema>;
