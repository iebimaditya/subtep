import { NextRequest } from "next/server";
import z from "zod/v4";

import { getTransactionsToTransactions } from "../../../lib/dto";
import { getTransactions } from "../../../lib/my-pertamina/apis";
import { getTransactionsResponseSchema } from "../../../lib/my-pertamina/schema";
import { withAuth } from "../../../middlewares/with-auth";

const getTransactionsParamsSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

async function secretGET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const parsedParams = getTransactionsParamsSchema.safeParse({
    startDate: startDateParam,
    endDate: endDateParam,
  });

  if (parsedParams.error) {
    return new Response(
      JSON.stringify({ error: parsedParams.error.issues[0].message }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const { startDate, endDate } = parsedParams.data;

  const res = await getTransactions(startDate, endDate);

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        error:
          "We couldn’t load your transaction history right now. Please try again in a few moments—or contact support if it keeps failing.",
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
  const parsedResBody = getTransactionsResponseSchema.safeParse(resBody);

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

  const transactions = getTransactionsToTransactions(parsedResBody.data);

  return new Response(JSON.stringify({ transactions }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const GET = withAuth(secretGET);
