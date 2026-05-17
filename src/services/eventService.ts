import prisma from "../config/prisma";

// eventService handles all DB operations related to the Event model.
// Events are created automatically when a Booking is APPROVED.
// They are NOT created manually by users.

export const findAll = async () => {
  return prisma.event.findMany({
    orderBy: { event: "asc" },
    include: {
      hall: { select: { id: true, name: true, location: true } },
      booking: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
    },
  });
};

export const findById = async (id: number) => {
  return prisma.event.findUnique({
    where: { id },
    include: {
      hall: true,
      booking: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
};

export const findUpcoming = async () => {
  return prisma.event.findMany({
    where: {
      event: { gte: new Date() },
    },
    orderBy: { event: "asc" },
    include: {
      hall: { select: { id: true, name: true, location: true } },
    },
  });
};

// createFromBooking — called internally when admin approves a booking.
export const createFromBooking = async (data: {
  bookingId: number;
  hallId: number;
  title: string;
  description: string;
  eventDate: Date;
}) => {
  return prisma.event.create({
    data: {
      bookingId: data.bookingId,
      hallId: data.hallId,
      title: data.title,
      description: data.description,
      event: data.eventDate,
    },
  });
};

export const deleteEvent = async (id: number) => {
  return prisma.event.delete({ where: { id } });
};
