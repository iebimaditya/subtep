import { NextRequest } from "next/server";
import z from "zod/v4";

import { verifyCustomerResponseToCustomer } from "../../../../lib/dto";
import { verifyCustomer } from "../../../../lib/my-pertamina/apis";
import { verifyCustomerResponseSchema } from "../../../../lib/my-pertamina/schema";
import { nationalityIdSchema } from "../../../../lib/schema";
import { withAuth } from "../../../../middlewares/with-auth";

const verifyCustomerRequestSchema = z.object({
  nationalityId: nationalityIdSchema,
});

async function secretPOST(req: NextRequest) {
  const reqBody = await req.json();
  const parsedReqBody = verifyCustomerRequestSchema.safeParse(reqBody);

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

  const { nationalityId } = parsedReqBody.data;

  const res = await verifyCustomer(nationalityId);

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        error:
          "We couldn’t verify your ID just now. Please check the number and try again, or contact support if this keeps happening.",
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
  const parsedResBody = verifyCustomerResponseSchema.safeParse(resBody);

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

  const customer = verifyCustomerResponseToCustomer(
    parsedResBody.data,
    nationalityId
  );

  return new Response(JSON.stringify({ customer }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const POST = withAuth(secretPOST);
