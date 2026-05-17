import prisma from "../config/prisma";

export const findAll = async () => {
  return prisma.hall.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          booking: { where: { status: { in: ["PENDING", "APPROVED"] } } },
        },
      },
    },
  });
};

export const findById = async (id: number) => {
  return prisma.hall.findUnique({
    where: { id },
    include: {
      booking: {
        where: { status: { in: ["PENDING", "APPROVED"] } },
        orderBy: { bookingDate: "asc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      events: {
        orderBy: { event: "asc" },
      },
    },
  });
};

export const findBookingsOnDate = async (hallId: number, dateStr: string) => {
  const dayStart = new Date(dateStr);
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(dateStr);
  dayEnd.setUTCHours(23, 59, 59, 999);

  return prisma.booking.findMany({
    where: {
      hallId,
      bookingDate: { gte: dayStart, lte: dayEnd },
      status: { in: ["PENDING", "APPROVED"] },
    },
    select: { id: true, purpose: true, status: true, bookingDate: true },
  });
};

export const createHall = async (data: {
  name: string;
  location: string;
  capacity: number;
}) => {
  return prisma.hall.create({ data });
};

export const updateHall = async (
  id: number,
  data: Partial<{ name: string; location: string; capacity: number }>
) => {
  return prisma.hall.update({ where: { id }, data });
};

export const deleteHall = async (id: number) => {
  return prisma.hall.delete({ where: { id } });
};

export const getAdminStats = async () => {
  const [pendingCount, hallCount] = await Promise.all([
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.hall.count(),
  ]);
  return { pendingCount, hallCount };
};
