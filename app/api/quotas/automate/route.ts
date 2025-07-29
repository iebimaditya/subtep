import { TIMEOUT_THRESHOLD } from "../../../../lib/constants";
import {
  createBatchOfNationalityIds,
  getCustomerWithQuota,
  getFile,
  writeFile,
} from "../../../../lib/helpers/automate.helpers";
import {
  customersWithQuotaFileSchema,
  CustomerWithQuota,
  nationalityIdsFileSchema,
} from "../../../../lib/schema";
import { wait } from "../../../../lib/utils";
import { withAuth } from "../../../../middlewares/with-auth";

async function secretPOST() {
  const nationalityIds = await getFile(
    "nationality-ids.json",
    nationalityIdsFileSchema
  );

  const batches = createBatchOfNationalityIds(nationalityIds);
  const flattenedCustomers: CustomerWithQuota[] = [];

  for (const batch of batches) {
    const batchedCustomersWithQuota: CustomerWithQuota[] = [];

    for (const nationalityId of batch) {
      const customerWithQuota = await getCustomerWithQuota(nationalityId);

      if (!customerWithQuota) continue;

      batchedCustomersWithQuota.push(customerWithQuota);
    }

    flattenedCustomers.push(...batchedCustomersWithQuota);

    const customersWithQuota = await getFile(
      "customers.json",
      customersWithQuotaFileSchema
    );
    await writeFile("customers.json", [
      ...customersWithQuota,
      ...batchedCustomersWithQuota,
    ]);
    await wait(TIMEOUT_THRESHOLD);
  }

  return new Response(JSON.stringify({ customers: flattenedCustomers }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const POST = withAuth(secretPOST);
