import z from "zod/v4";

import { getQuotaResponseToQuota } from "../../../lib/dto";
import { getQuota } from "../../../lib/my-pertamina/apis";
import { getQuotaResponseSchema } from "../../../lib/my-pertamina/schema";
import { customerTypeSchema, nationalityIdSchema } from "../../../lib/schema";
import { withAuth } from "../../../middlewares/with-auth";

const getQuotaRequestSchema = z.object({
  nationalityId: nationalityIdSchema,
  encryptedFamilyId: z.string(),
  customerType: customerTypeSchema,
});

async function secretPOST(req: Request) {
  const reqBody = await req.json();
  const parsedReqBody = getQuotaRequestSchema.safeParse(reqBody);

  if (parsedReqBody.error) {
    return new Response(
      JSON.stringify({ error: parsedReqBody.error.issues[0].message }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const { nationalityId, encryptedFamilyId, customerType } = parsedReqBody.data;

  const res = await getQuota(nationalityId, encryptedFamilyId, customerType);

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        error:
          "We couldn’t retrieve your quota just now. Please try again shortly—or contact support if the issue persists.",
      }),
      {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const resBody = await res.json();
  const parsedResBody = getQuotaResponseSchema.safeParse(resBody);

  if (parsedResBody.error) {
    return new Response(
      JSON.stringify({ error: parsedResBody.error.issues[0].message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const quota = getQuotaResponseToQuota(parsedResBody.data);

  return new Response(JSON.stringify({ nationalityId, customerType, quota }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const POST = withAuth(secretPOST);
