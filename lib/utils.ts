import { headers } from "next/headers";

export async function getBearerToken() {
  const reqHeaders = await headers();
  const authHeader = reqHeaders.get("Authorization");
  const bearerKey = "Bearer ";

  if (!authHeader || !authHeader.startsWith(bearerKey)) return null;

  const bearerToken = authHeader.slice(bearerKey.length).trim();

  return bearerToken;
}

export async function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function errorResponse(error: string, status: number) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function successResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
