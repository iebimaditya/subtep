import z from "zod/v4";

import { customerTypeSchema as customerTypeNameSchema } from "../schema";

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

const customerTypeSchema = z.object({
  name: customerTypeNameSchema,
  sourceTypeId: z.number(),
  status: z.number(),
  verifications: z.array(z.unknown()),
  merchant: z.any().nullable(),
  isBlocked: z.boolean(),
  isQuotaValid: z.boolean(),
  registeredAt: z.string(),
});

export const verifyCustomerResponseSchema = createResponseSchema(
  z.object({
    nationalityId: z.string(),
    familyId: z.string(),
    familyIdEncrypted: z.string(),
    name: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    customerTypes: z.array(customerTypeSchema),
    channelInject: z.string(),
    isAgreedTermsConditions: z.boolean(),
    isCompleted: z.boolean(),
    isSubsidi: z.boolean(),
    isRecommendationLetter: z.boolean(),
    isBlocked: z.boolean(),
    isBusinessType: z.boolean(),
    isBusinessName: z.boolean(),
    token: z.string(),
    countDownTime: z.number(),
  })
);

export const getQuotaResponseSchema = createResponseSchema(
  z.object({
    quotaRemaining: z.object({
      daily: z.number(),
      monthly: z.number(),
      all: z.number(),
      family: z.number(),
    }),
  })
);

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type VerifyCustomerResponse = z.infer<
  typeof verifyCustomerResponseSchema
>;
export type GetQuotaResponse = z.infer<typeof getQuotaResponseSchema>;
