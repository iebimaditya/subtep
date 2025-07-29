import { BASE_ENDPOINT } from "./constants";
import { getBearerToken } from "./utils";

export async function login(identifier: string, pin: string) {
  const res = await fetch(`${BASE_ENDPOINT}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ identifier, pin }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}

export async function verifyCustomer(nationalityId: string) {
  const bearerToken = await getBearerToken();

  const res = await fetch(`${BASE_ENDPOINT}/api/verification`, {
    method: "POST",
    body: JSON.stringify({ nationalityId }),
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  });

  return res;
}

export async function getQuota(
  nationalityId: string,
  encryptedFamilyId: string,
  customerType: string
) {
  const bearerToken = await getBearerToken();

  const res = await fetch(`${BASE_ENDPOINT}/api/quotas`, {
    method: "POST",
    body: JSON.stringify({ nationalityId, encryptedFamilyId, customerType }),
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  });

  return res;
}
