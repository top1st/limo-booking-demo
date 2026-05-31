import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FloatingInput } from "@/components/ui/FloatingInput";

describe("FloatingInput", () => {
  it("shows an inline error message", () => {
    render(
      <FloatingInput
        label="Email"
        value=""
        onChange={() => {}}
        error="Email is required"
      />,
    );

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
});
