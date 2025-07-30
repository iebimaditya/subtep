import { Page } from "@playwright/test";

import { getQuota, verifyCustomer } from "./apis";
import { MY_PERTAMINA_ENDPOINT, MY_PERTAMINA_URL } from "./constants";
import {
  CustomerWithQuota,
  getQuotaResponseSchema,
  Transaction,
  verifyCustomerResponseSchema,
} from "./schema";

export async function gotoLoginPage(
  page: Page,
  options?: Parameters<typeof page.goto>[1]
) {
  await page.goto(`${MY_PERTAMINA_URL}/merchant-login`, options);
}

export async function fillIdentifier(page: Page, identifier: string) {
  await page.locator("#mantine-r0").fill(identifier);
}

export async function fillPin(page: Page, pin: string) {
  await page.locator("#mantine-r1").fill(pin);
}

export async function submitLoginForm(page: Page) {
  await page.locator("button[type='submit']").click();
}

export async function waitForLoginResponse(page: Page) {
  const waitedRes = await page.waitForResponse((res) => {
    const req = res.request();

    return (
      req.method() === "POST" &&
      req.url() === `${MY_PERTAMINA_ENDPOINT}/subuser/v1/login`
    );
  });

  return waitedRes;
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

export function getValidCustomersWithQuota(
  customersWithQuota: CustomerWithQuota[]
) {
  return customersWithQuota.filter(
    (customerWithQuota) => customerWithQuota.quota > 0
  );
}

export function getExceedTransactions(
  transactions: Transaction[],
  max: number = 5
) {
  return transactions.filter((transaction) => transaction.total > max);
}
