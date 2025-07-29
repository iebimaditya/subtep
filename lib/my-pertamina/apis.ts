import { MY_PERTAMINA_ENDPOINT } from "../constants";
import { getBearerToken } from "../utils";

export async function verifyCustomer(nationalityId: string) {
  const bearerToken = await getBearerToken();

  const res = await fetch(
    `${MY_PERTAMINA_ENDPOINT}/customers/v2/verify-nik?nationalityId=${nationalityId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res;
}
