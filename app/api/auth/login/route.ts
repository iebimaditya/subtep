import z from "zod/v4";

import { closeBrowser, createBrowser } from "../../../../lib/browser";
import { loginResponseToAccessToken } from "../../../../lib/dto";
import {
  fillIdentifier,
  fillPin,
  gotoLoginPage,
  submitLoginForm,
  waitForLoginResponse,
} from "../../../../lib/helpers/login.helper";
import { loginResponseSchema } from "../../../../lib/my-pertamina/schema";

export const loginRequestSchema = z.object({
  identifier: z.union([
    z.email({
      error: "Please enter a valid email address—like name@example.com.",
    }),
    z.string().regex(/^((?:\+62|62)|0)8[1-9][0-9]{6,10}$/, {
      error:
        "Must be a valid Indonesian mobile phone number, e.g. 081234567890 or +6281234567890.",
    }),
  ]),
  pin: z.string().regex(/^\d{6}$/, {
    error: "Please enter exactly six digits (0–9), like 123456.",
  }),
});

export async function POST(req: Request) {
  const reqBody = await req.json();
  const parsedReqBody = loginRequestSchema.safeParse(reqBody);

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

  const { identifier, pin } = parsedReqBody.data;
  const { browser, page } = await createBrowser();

  await gotoLoginPage(page, { waitUntil: "networkidle" });
  await fillIdentifier(page, identifier);
  await fillPin(page, pin);
  const [waitedRes] = await Promise.all([
    waitForLoginResponse(page),
    submitLoginForm(page),
  ]);

  if (!waitedRes.ok()) {
    return new Response(
      JSON.stringify({
        error:
          "We couldn’t process your login. Please try again or contact support if the issue persists.",
      }),
      {
        status: waitedRes.status(),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const resBody = await waitedRes.json();
  const parsedResBody = loginResponseSchema.safeParse(resBody);

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

  const accessToken = loginResponseToAccessToken(parsedResBody.data);

  await closeBrowser(browser);

  return new Response(JSON.stringify({ accessToken }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
