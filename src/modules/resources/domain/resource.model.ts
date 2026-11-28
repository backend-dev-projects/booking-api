import type { BookingMode } from "./enums/booking-mode.enum.js";

export interface Resource {
  id: string;
  resource_type_id: string;
  booking_mode: BookingMode;
  name: string;
  capacity: number;
  description: string | null;
  floor: number | null;
}
