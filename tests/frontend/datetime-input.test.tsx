import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { PickupDateTimeFields } from "@/components/ui/DateTimeInput";
import type { BookingFormValues } from "@/lib/validation";

function DateTimeHarness() {
  const { control, formState: { errors } } = useForm<BookingFormValues>({
    defaultValues: {
      pickupDate: "2026-06-02",
      pickupTime: "15:00",
    } as BookingFormValues,
  });

  return <PickupDateTimeFields control={control} errors={errors} />;
}

describe("PickupDateTimeFields", () => {
  it("renders date and time inside bordered fields with formatted values", () => {
    render(<DateTimeHarness />);

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("06/02/2026")).toBeInTheDocument();
    expect(screen.getByText("03:00 PM")).toBeInTheDocument();
  });

  it("opens custom date picker with gold-themed calendar", async () => {
    const user = userEvent.setup();
    render(<DateTimeHarness />);

    await user.click(screen.getByRole("button", { name: "Open date picker" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "15" })).toBeInTheDocument();
  });
});
