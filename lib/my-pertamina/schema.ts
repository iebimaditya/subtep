import z from "zod/v4";

export const baseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  code: z.number(),
  status: z.string(),
});

export function createResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return baseResponseSchema.extend({ data: dataSchema });
}

export const loginResponseSchema = createResponseSchema(
  z.object({
    accessToken: z.string(),
    isLogin: z.boolean(),
    myptmMerchantType: z.enum(["LPG"]),
    isDefaultPin: z.boolean(),
    isNewUserMyptm: z.boolean(),
    isSubsidiProduct: z.boolean(),
    isRetailerEnable: z.boolean(),
    retailerMaxDate: z.string(),
    isRegisterSubPangkalan: z.boolean(),
    allowNonRetailerRegistration: z.boolean(),
    isSubUser: z.boolean(),
    isTermAgreed: z.boolean(),
    isContractAgreed: z.boolean(),
    isIdentityOnboarded: z.boolean(),
    isBusinessOnboarded: z.boolean(),
    isProductOnboarded: z.boolean(),
    status: z.number(),
  })
);

export type LoginResponse = z.infer<typeof loginResponseSchema>;
