export type ServiceType = "one-way" | "hourly";
export type LocationType = "location" | "airport";

export interface PlaceLocation {
  placeId: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteEstimate {
  distanceMeters: number;
  durationSeconds: number;
  distanceText: string;
  durationText: string;
  path?: LatLng[];
}

export interface CustomerLookupResult {
  found: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface BookingPayload {
  serviceType: ServiceType;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: PlaceLocation;
  stops: PlaceLocation[];
  dropoffLocation?: PlaceLocation;
  hourlyDuration?: number;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  passengers: number;
  routeEstimate?: RouteEstimate;
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  message: string;
  summary: {
    serviceType: ServiceType;
    passengers: number;
    pickupDate: string;
    pickupTime: string;
    pickupAddress: string;
    dropoffAddress?: string;
    phone: string;
    customerName?: string;
    routeEstimate?: RouteEstimate;
  };
}
