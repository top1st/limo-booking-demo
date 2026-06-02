import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { InternationalPhoneInput } from "@/components/ui/InternationalPhoneInput";

function PhoneInputHarness() {
  const [value, setValue] = useState("");

  return (
    <InternationalPhoneInput
      id="phone-test"
      value={value}
      onChange={setValue}
      placeholder="774 415 3244"
    />
  );
}

describe("InternationalPhoneInput", () => {
  it("renders country dropdown with accessible label", () => {
    render(
      <InternationalPhoneInput
        id="phone"
        value=""
        onChange={() => {}}
        placeholder="774 415 3244"
      />,
    );

    expect(screen.getByLabelText("Phone number country")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("774 415 3244")).toBeInTheDocument();
  });

  it("accepts a US number", async () => {
    const user = userEvent.setup();
    render(<PhoneInputHarness />);

    const input = screen.getByPlaceholderText("774 415 3244");
    expect(screen.getByLabelText("Phone number country")).toBeInTheDocument();

    await user.type(input, "7744153244");

    expect(input).toHaveValue("+1 774 415 3244");
  });
});
