import { getQuotaResponseToQuota } from "../../../lib/dto";
import { getQuota } from "../../../lib/my-pertamina/apis";
import { getQuotaResponseSchema } from "../../../lib/my-pertamina/schema";
import { getQuotaRequestSchema } from "../../../lib/schema";
import { errorResponse, successResponse } from "../../../lib/utils";
import { withAuth } from "../../../middlewares/with-auth";

async function secretPOST(req: Request) {
  const reqBody = await req.json();
  const parsedReqBody = getQuotaRequestSchema.safeParse(reqBody);

  if (parsedReqBody.error) {
    return errorResponse(parsedReqBody.error.issues[0].message, 400);
  }

  const { nationalityId, encryptedFamilyId, customerType } = parsedReqBody.data;

  const res = await getQuota(nationalityId, encryptedFamilyId, customerType);

  if (!res.ok) {
    return errorResponse(
      "We couldn’t retrieve your quota just now. Please try again shortly—or contact support if the issue persists.",
      res.status
    );
  }

  const resBody = await res.json();
  const parsedRes = getQuotaResponseSchema.safeParse(resBody);

  if (parsedRes.error) {
    return errorResponse(parsedRes.error.issues[0].message, 500);
  }

  const quota = getQuotaResponseToQuota(parsedRes.data);

  return successResponse({ nationalityId, customerType, quota });
}

export const POST = withAuth(secretPOST);
