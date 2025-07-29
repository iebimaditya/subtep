import { NextRequest } from "next/server";

import { verifyCustomerResponseToCustomer } from "../../../../lib/dto";
import { verifyCustomer } from "../../../../lib/my-pertamina/apis";
import { verifyCustomerResponseSchema } from "../../../../lib/my-pertamina/schema";
import { verifyCustomerRequestSchema } from "../../../../lib/schema";
import { errorResponse, successResponse } from "../../../../lib/utils";
import { withAuth } from "../../../../middlewares/with-auth";

async function secretPOST(req: NextRequest) {
  const reqBody = await req.json();
  const parsedReq = verifyCustomerRequestSchema.safeParse(reqBody);

  if (parsedReq.error) {
    return errorResponse(parsedReq.error.issues[0].message, 400);
  }

  const { nationalityId } = parsedReq.data;

  const res = await verifyCustomer(nationalityId);

  if (!res.ok) {
    return errorResponse(
      "We couldn’t verify your ID just now. Please check the number and try again, or contact support if this keeps happening.",
      res.status
    );
  }

  const resBody = await res.json();
  const parsedResBody = verifyCustomerResponseSchema.safeParse(resBody);

  if (parsedResBody.error) {
    return errorResponse(parsedResBody.error.issues[0].message, 500);
  }

  const customer = verifyCustomerResponseToCustomer(
    parsedResBody.data,
    nationalityId
  );

  return successResponse({ customer });
}

export const POST = withAuth(secretPOST);
