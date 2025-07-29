const ENDPOINT = "http://localhost:3000";

export async function login(identifier: string, pin: string) {
  const res = await fetch(`${ENDPOINT}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ identifier, pin }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}
