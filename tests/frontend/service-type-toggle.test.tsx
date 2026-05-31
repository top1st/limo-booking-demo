import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ServiceTypeToggle } from "@/components/ServiceTypeToggle";

describe("ServiceTypeToggle", () => {
  it("calls onChange with hourly when clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<ServiceTypeToggle value="one-way" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Hourly" }));

    expect(onChange).toHaveBeenCalledWith("hourly");
  });
});
