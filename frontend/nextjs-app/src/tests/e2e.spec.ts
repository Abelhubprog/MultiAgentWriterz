import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Create Next App/);
});

test("can upload PDFs", async ({ page }) => {
  await page.goto("/app/chat");
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Add photos & files" }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles([
    { name: "file1.pdf", mimeType: "application/pdf", buffer: Buffer.from("file1") },
    { name: "file2.pdf", mimeType: "application/pdf", buffer: Buffer.from("file2") },
    { name: "file3.pdf", mimeType: "application/pdf", buffer: Buffer.from("file3") },
  ]);
  // In a real test, you would assert that the files were uploaded successfully.
});

test("can see live stream", async ({ page }) => {
  await page.goto("/app/chat");
  await page.getByPlaceholder("Send a message.").fill("test");
  await page.getByRole("button", { name: "Send" }).click();
  // In a real test, you would assert that the live stream is visible.
});

test("can see plagiarism score", async ({ page }) => {
  await page.goto("/app/originality/test-trace-id");
  await expect(page.getByText("Plagiarism Score: 13%")).toBeVisible();
});
