import {
  GetQuotaResponse,
  GetTransactionsResponse,
  LoginResponse,
  VerifyCustomerResponse,
} from "./my-pertamina/schema";
import { Customer, CustomerType, Transaction } from "./schema";

export function loginResponseToAccessToken({ data }: LoginResponse): string {
  return data.accessToken;
}

export function verifyCustomerResponseToCustomer(
  { data }: VerifyCustomerResponse,
  nationalityId: string
): Customer {
  return {
    nationalityId,
    familyId: data.familyId,
    encryptedFamilyId: data.familyIdEncrypted,
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    types: data.customerTypes.map(
      (customerType) => customerType.name as CustomerType
    ),
  };
}

export function getQuotaResponseToQuota({ data }: GetQuotaResponse): number {
  return data.quotaRemaining.daily;
}

export function getTransactionsToTransactions({
  data,
}: GetTransactionsResponse): Transaction[] {
  return data.customersReport.map((customerReport) => ({
    id: customerReport.customerReportId,
    nationalityId: customerReport.nationalityId,
    name: customerReport.name,
    type: customerReport.categories[0],
    total: customerReport.total,
  }));
}
