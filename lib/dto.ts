import { LoginResponse, VerificationResponse } from "./my-pertamina/schema";

export function loginResponseToAccessToken({ data }: LoginResponse) {
  return data.accessToken;
}

export function verificationResponseToCustomer(
  { data }: VerificationResponse,
  nationalityId: string
) {
  return {
    nationalityId,
    familyId: data.familyId,
    encryptedFamilyId: data.familyIdEncrypted,
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    types: data.customerTypes.map((customerType) => customerType.name),
  };
}
