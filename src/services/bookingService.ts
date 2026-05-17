import prisma from "../config/prisma";

export const findAll = async (filters?: { status?: string; hallId?: number }) => {
  return prisma.booking.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.hallId && { hallId: filters.hallId }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      hall: { select: { id: true, name: true, location: true } },
    },
  });
};

export const findByUserId = async (userId: number) => {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { bookingDate: "desc" },
    include: {
      hall: { select: { id: true, name: true, location: true } },
    },
  });
};

export const findById = async (id: number) => {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      hall: true,
      event: true,
    },
  });
};

export const createBooking = async (data: {
  userId: number;
  hallId: number;
  purpose: string;
  bookingDate: Date;
}) => {
  return prisma.booking.create({
    data: {
      userId: data.userId,
      hallId: data.hallId,
      purpose: data.purpose,
      bookingDate: data.bookingDate,
      status: "PENDING",
    },
    include: {
      hall: { select: { id: true, name: true, location: true } },
    },
  });
};

export const updateStatus = async (
  id: number,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  return prisma.booking.update({
    where: { id },
    data: { status },
    include: {
      user: { select: { id: true, name: true, email: true } },
      hall: true,
    },
  });
};

export const cancelBooking = async (id: number) => {
  return prisma.booking.update({
    where: { id },
    data: { status: "REJECTED" },
  });
};
