import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  isAdmin?: boolean;
  adminEmail?: string;
}

/** Fixed slots for UI only — stored booking uses bookingDate + purpose */
export const DEFAULT_TIME_SLOTS = [
  { startTime: "08:00", endTime: "10:00", label: "08:00 - 10:00" },
  { startTime: "10:00", endTime: "12:00", label: "10:00 - 12:00" },
  { startTime: "14:00", endTime: "16:00", label: "14:00 - 16:00" },
  { startTime: "17:00", endTime: "22:00", label: "05:00 PM - 10:00 PM" },
] as const;
