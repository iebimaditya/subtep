import { Page } from "@playwright/test";

import { MY_PERTAMINA_ENDPOINT, MY_PERTAMINA_URL } from "../constants";

export async function gotoLoginPage(
  page: Page,
  options?: Parameters<typeof page.goto>[1]
) {
  await page.goto(`${MY_PERTAMINA_URL}/merchant-login`, options);
}

export async function fillIdentifier(page: Page, identifier: string) {
  await page.locator("#mantine-r0").fill(identifier);
}

export async function fillPin(page: Page, pin: string) {
  await page.locator("#mantine-r1").fill(pin);
}

export async function submitLoginForm(page: Page) {
  await page.locator("button[type='submit']").click();
}

export async function waitForLoginResponse(page: Page) {
  const waitedRes = await page.waitForResponse((res) => {
    const req = res.request();

    return (
      req.method() === "POST" &&
      req.url() === `${MY_PERTAMINA_ENDPOINT}/subuser/v1/login`
    );
  });

  return waitedRes;
}
