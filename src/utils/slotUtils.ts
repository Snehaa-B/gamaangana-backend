import { DEFAULT_TIME_SLOTS } from "../types";

/** Slot label is stored at the start of purpose, e.g. "[05:00 PM - 10:00 PM] Meeting ..." */
export function extractSlotLabelFromPurpose(purpose: string): string | null {
  const match = purpose.trim().match(/^\[([^\]]+)\]/);
  return match ? match[1].trim() : null;
}

export function normalizeSlotLabel(label: string): string {
  return label.replace(/\s+/g, " ").trim().toLowerCase();
}

export function slotsMatch(slotA: string, slotB: string): boolean {
  return normalizeSlotLabel(slotA) === normalizeSlotLabel(slotB);
}

export function slotLabelBelongsToDefaultSlots(label: string): boolean {
  return DEFAULT_TIME_SLOTS.some((s) => slotsMatch(s.label, label));
}

const ACTIVE_STATUSES = new Set(["PENDING", "APPROVED"]);

export function buildSlotAvailability(
  bookings: { purpose: string; status: string }[]
): Array<(typeof DEFAULT_TIME_SLOTS)[number] & { status: string }> {
  const active = bookings.filter((b) => ACTIVE_STATUSES.has(b.status));

  const bookedLabels = active
    .map((b) => extractSlotLabelFromPurpose(b.purpose))
    .filter((l): l is string => l != null && l.length > 0);

  const hasLegacyFullDayBlock = active.some(
    (b) => extractSlotLabelFromPurpose(b.purpose) == null
  );

  return DEFAULT_TIME_SLOTS.map((slot) => {
    let isBooked = bookedLabels.some((label) => slotsMatch(slot.label, label));
    if (hasLegacyFullDayBlock) {
      isBooked = true;
    }
    return { ...slot, status: isBooked ? "BOOKED" : "FREE" };
  });
}

export function hasSlotConflict(
  purpose: string,
  existingBookings: { purpose: string; status: string }[]
): boolean {
  const active = existingBookings.filter((b) => ACTIVE_STATUSES.has(b.status));
  if (active.length === 0) return false;

  const newLabel = extractSlotLabelFromPurpose(purpose);
  if (!newLabel) {
    return active.length > 0;
  }

  return active.some((b) => {
    const existingLabel = extractSlotLabelFromPurpose(b.purpose);
    if (!existingLabel) return true;
    return slotsMatch(newLabel, existingLabel);
  });
}
