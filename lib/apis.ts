import { BASE_ENDPOINT } from "./constants";

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
