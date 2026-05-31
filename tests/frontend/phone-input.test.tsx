import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { PhoneInput } from "@/components/ui/PhoneInput";

function PhoneInputHarness() {
  const [value, setValue] = useState("");

  return (
    <PhoneInput
      aria-label="Phone"
      value={value}
      onChange={setValue}
      prefix={<span>+1</span>}
    />
  );
}

describe("PhoneInput", () => {
  it("allows deleting digits after entering a full number", async () => {
    const user = userEvent.setup();
    render(<PhoneInputHarness />);

    const input = screen.getByRole("textbox", { name: "Phone" });
    await user.type(input, "7744153244");

    expect(input).toHaveValue("774 415 3244");

    for (let i = 0; i < 4; i++) {
      await user.keyboard("{Backspace}");
    }

    expect(input).toHaveValue("774 415");
  });
});
