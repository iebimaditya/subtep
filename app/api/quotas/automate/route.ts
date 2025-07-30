import { TIMEOUT_THRESHOLD } from "../../../../lib/constants";
import {
  createBatchOfNationalityIds,
  getCustomerWithQuota,
  getValidCustomersWithQuota,
} from "../../../../lib/helpers";
import {
  customersWithQuotaFileSchema,
  CustomerWithQuota,
  nationalityIdsFileSchema,
} from "../../../../lib/schema";
import {
  getFile,
  successResponse,
  wait,
  writeFile,
} from "../../../../lib/utils";
import { withAuth } from "../../../../middlewares/with-auth";

async function secretPOST() {
  const nationalityIds = await getFile(
    "private/data/nationality-ids.json",
    nationalityIdsFileSchema
  );

  const batches = createBatchOfNationalityIds(nationalityIds);
  const flattenedCustomersWithQuota: CustomerWithQuota[] = [];

  for (const batch of batches) {
    const batchedCustomersWithQuota: CustomerWithQuota[] = [];

    for (const nationalityId of batch) {
      const customerWithQuota = await getCustomerWithQuota(nationalityId);

      if (!customerWithQuota) continue;

      batchedCustomersWithQuota.push(customerWithQuota);
    }

    flattenedCustomersWithQuota.push(...batchedCustomersWithQuota);

    const customersWithQuota = await getFile(
      "private/data/customers-with-quota.json",
      customersWithQuotaFileSchema
    );
    await writeFile("private/data/customers-with-quota.json", [
      ...customersWithQuota,
      ...batchedCustomersWithQuota,
    ]);

    const validCustomersWithQuota =
      getValidCustomersWithQuota(customersWithQuota);
    await writeFile(
      "private/data/valid-customers-with-quota.json",
      validCustomersWithQuota
    );

    await wait(TIMEOUT_THRESHOLD);
  }

  return successResponse({ customersWithQuota: flattenedCustomersWithQuota });
}

export const POST = withAuth(secretPOST);
