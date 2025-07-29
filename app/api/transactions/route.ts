import { NextRequest } from "next/server";

import { getTransactionsToTransactions } from "../../../lib/dto";
import { getTransactions } from "../../../lib/my-pertamina/apis";
import { getTransactionsResponseSchema } from "../../../lib/my-pertamina/schema";
import { getTransactionsRequestSchema } from "../../../lib/schema";
import { errorResponse, successResponse } from "../../../lib/utils";
import { withAuth } from "../../../middlewares/with-auth";

async function secretGET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const parsedReq = getTransactionsRequestSchema.safeParse({
    startDate: startDateParam,
    endDate: endDateParam,
  });

  if (parsedReq.error) {
    return errorResponse(parsedReq.error.issues[0].message, 400);
  }

  const { startDate, endDate } = parsedReq.data;

  const res = await getTransactions(startDate, endDate);

  if (!res.ok) {
    return errorResponse(
      "We couldn’t load your transaction history right now. Please try again in a few moments—or contact support if it keeps failing.",
      res.status
    );
  }

  const resBody = await res.json();
  const parsedRes = getTransactionsResponseSchema.safeParse(resBody);

  if (parsedRes.error) {
    return errorResponse(parsedRes.error.issues[0].message, 500);
  }

  const transactions = getTransactionsToTransactions(parsedRes.data);

  return successResponse({ transactions });
}

export const GET = withAuth(secretGET);
