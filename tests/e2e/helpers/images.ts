import { expect, type Locator } from "@playwright/test";

export async function expectImageLoaded(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  await expect(locator).toBeVisible();

  await expect
    .poll(async () => {
      return await locator.evaluate((node) => {
        const image = node as HTMLImageElement;

        return (
          image.complete &&
          image.naturalWidth > 0 &&
          window.getComputedStyle(image).opacity !== "0"
        );
      });
    })
    .toBe(true);
}

const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9sX7L6sAAAAASUVORK5CYII=";

export function createTinyPngUpload(name = "tiny-preview.png") {
  return {
    name,
    mimeType: "image/png",
    buffer: Buffer.from(TINY_PNG_BASE64, "base64"),
  };
}
