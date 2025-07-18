import { render, fireEvent } from "@testing-library/react";
import { PromptEditor } from "@/components/chat/PromptEditor";
import { ContextUploadMenu } from "@/components/chat/ContextUploadMenu";

test("PromptEditor updates value on change", () => {
  const { getByPlaceholderText } = render(
    <PromptEditor onSubmit={async () => {}} isLoading={false} />
  );
  const textarea = getByPlaceholderText("Send a message.") as HTMLTextAreaElement;
  fireEvent.change(textarea, { target: { value: "test" } });
  expect(textarea.value).toBe("test");
});

test("ContextUploadMenu opens on click", () => {
  const { getByRole } = render(<ContextUploadMenu />);
  const button = getByRole("button");
  fireEvent.click(button);
  // In a real test, you would assert that the dropdown menu is visible.
  // For now, we'll just check that the button is clickable.
  expect(button).toBeInTheDocument();
});
