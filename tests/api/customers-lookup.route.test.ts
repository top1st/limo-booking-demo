// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db", () => ({
  lookupCustomer: vi.fn(),
}));

import { lookupCustomer } from "@/lib/db";
import { GET } from "@/app/api/customers/lookup/route";

describe("GET /api/customers/lookup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when phone is missing", async () => {
    const request = new NextRequest("http://localhost/api/customers/lookup");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Phone number is required" });
  });

  it("returns 400 when phone is invalid", async () => {
    const request = new NextRequest(
      "http://localhost/api/customers/lookup?phone=123",
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Invalid phone number" });
  });

  it("returns customer lookup payload when phone is valid", async () => {
    const mockLookup = vi.mocked(lookupCustomer);
    mockLookup.mockResolvedValue({
      found: true,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
    });

    const request = new NextRequest(
      "http://localhost/api/customers/lookup?phone=%2B15551234567",
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockLookup).toHaveBeenCalledWith("+15551234567");
    expect(body).toEqual({
      found: true,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
    });
  });
});
