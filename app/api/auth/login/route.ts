import { closeBrowser, createBrowser } from "../../../../lib/browser";
import { loginResponseToAccessToken } from "../../../../lib/dto";
import {
  fillIdentifier,
  fillPin,
  gotoLoginPage,
  submitLoginForm,
  waitForLoginResponse,
} from "../../../../lib/helpers";
import { loginResponseSchema } from "../../../../lib/my-pertamina/schema";
import { loginRequestSchema } from "../../../../lib/schema";
import { errorResponse, successResponse } from "../../../../lib/utils";

export async function POST(req: Request) {
  const reqBody = await req.json();
  const parsedReq = loginRequestSchema.safeParse(reqBody);

  if (parsedReq.error) {
    return errorResponse(parsedReq.error.issues[0].message, 400);
  }

  const { identifier, pin } = parsedReq.data;
  const { browser, page } = await createBrowser();

  await gotoLoginPage(page, { waitUntil: "networkidle" });
  await fillIdentifier(page, identifier);
  await fillPin(page, pin);
  const [res] = await Promise.all([
    waitForLoginResponse(page),
    submitLoginForm(page),
  ]);

  if (!res.ok()) {
    return errorResponse(
      "We couldn’t process your login. Please try again or contact support if the issue persists.",
      res.status()
    );
  }

  const resBody = await res.json();
  const parsedRes = loginResponseSchema.safeParse(resBody);

  if (parsedRes.error) {
    return errorResponse(parsedRes.error.issues[0].message, 500);
  }

  const accessToken = loginResponseToAccessToken(parsedRes.data);

  await closeBrowser(browser);

  return successResponse({ accessToken });
}
