import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

vi.mock("@/components/BookingForm", () => ({
  BookingForm: () => <div data-testid="booking-form-mock">Booking Form</div>,
}));

describe("Home page", () => {
  it("renders heading and booking form container", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: "Let's get you on your way!",
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("booking-form-mock")).toBeInTheDocument();
  });
});
