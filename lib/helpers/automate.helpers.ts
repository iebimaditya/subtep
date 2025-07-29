import fs from "fs";
import path from "path";
import z from "zod/v4";

import { getQuota, verifyCustomer } from "../apis";
import {
  CustomerWithQuota,
  getQuotaResponseSchema,
  verifyCustomerResponseSchema,
} from "../schema";

export async function getFile<T extends z.ZodTypeAny>(
  filename: string,
  schema: T
) {
  const filePath = path.join(process.cwd(), "private", "data", filename);

  const file = await fs.promises.readFile(filePath, "utf8");
  const parsedFile = schema.parse(JSON.parse(file));

  return parsedFile;
}

export async function writeFile(filename: string, data: any) {
  const filePath = path.join(process.cwd(), "private", "data", filename);

  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
}

export function createBatchOfNationalityIds(
  nationalityIds: string[],
  numberOfBatch: number = 10
) {
  const batches: string[][] = [];
  let batch: string[] = [];

  for (const [index, nationalityId] of nationalityIds.entries()) {
    batch.push(nationalityId);

    if (
      (index + 1) % numberOfBatch === 0 ||
      index + 1 === nationalityIds.length
    ) {
      batches.push(batch);
      batch = [];
    }
  }

  return batches;
}

export async function getCustomerWithQuota(
  nationalityId: string
): Promise<CustomerWithQuota | null> {
  const verifyCustomerRes = await verifyCustomer(nationalityId);

  if (!verifyCustomerRes.ok) {
    return null;
  }

  const verifyCustomerResBody = await verifyCustomerRes.json();
  const parsedVerifyCustomerRes = verifyCustomerResponseSchema.safeParse(
    verifyCustomerResBody
  );

  if (parsedVerifyCustomerRes.error) {
    return null;
  }

  const { customer } = parsedVerifyCustomerRes.data;

  const getQuotaRes = await getQuota(
    nationalityId,
    customer.encryptedFamilyId,
    customer.types[0]
  );

  if (!getQuotaRes.ok) {
    return null;
  }

  const getQuotaResBody = await getQuotaRes.json();
  const parsedGetQuotaRes = getQuotaResponseSchema.safeParse(getQuotaResBody);

  if (parsedGetQuotaRes.error) {
    return null;
  }

  const { customerType, quota } = parsedGetQuotaRes.data;

  return {
    nationalityId,
    familyId: customer.familyId,
    encryptedFamilyId: customer.encryptedFamilyId,
    name: customer.name,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    type: customerType,
    quota,
  };
}
