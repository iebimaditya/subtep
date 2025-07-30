import fs from "fs";
import { headers } from "next/headers";
import path from "path";
import z from "zod/v4";

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

export async function getFile<T extends z.ZodTypeAny>(
  filename: string,
  schema: T
) {
  const filePath = path.join(process.cwd(), filename);

  const file = await fs.promises.readFile(filePath, "utf8");
  const parsedFile = schema.parse(JSON.parse(file));

  return parsedFile;
}

export async function writeFile(filename: string, data: any) {
  const filePath = path.join(process.cwd(), filename);

  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
}
