import { describe, expect, it } from "vitest";
import { decodePolyline } from "@/lib/maps/polyline";

describe("decodePolyline", () => {
  it("decodes a short encoded polyline into lat/lng points", () => {
    const points = decodePolyline("_p~iF~ps|U_ulLnnqC_mqNvxq`@");

    expect(points.length).toBeGreaterThan(1);
    expect(points[0]).toEqual({ lat: 38.5, lng: -120.2 });
    expect(points[1].lat).toBeCloseTo(40.7, 1);
    expect(points[1].lng).toBeCloseTo(-120.95, 1);
  });
});
