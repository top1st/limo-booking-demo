import { NextRequest, NextResponse } from "next/server";
import { lookupCustomer } from "@/lib/db";
import { isValidPhone, normalizePhone } from "@/lib/phone";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const result = await lookupCustomer(normalizePhone(phone));
  return NextResponse.json(result);
}
