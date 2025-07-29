import { Browser, firefox } from "@playwright/test";

export async function createBrowser() {
  const browser = await firefox.launch({ headless: false, args: ["--kiosk"] });
  const context = await browser.newContext();
  const page = await context.newPage();

  return { browser, context, page };
}

export async function closeBrowser(browser: Browser) {
  for (const context of browser.contexts()) {
    for (const page of context.pages()) {
      await page.close();
    }

    await context.close();
  }

  await browser.close();
}
