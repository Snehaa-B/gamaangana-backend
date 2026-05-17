import prisma from "../config/prisma";

// userService handles all DB operations related to the User model.
// Firebase handles authentication — this service manages the app-side user record.

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
};

export const createUser = async (data: {
  name: string;
  email: string;
  role?: string;
}) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role ?? "USER",
    },
  });
};

// Register is an upsert — safe to call multiple times.
// If the user already exists, returns the existing record.
export const registerOrFetch = async (data: {
  name: string;
  email: string;
}) => {
  const existing = await findByEmail(data.email);
  if (existing) return existing;
  return createUser(data);
};

export const updateRole = async (id: number, role: string) => {
  return prisma.user.update({
    where: { id },
    data: { role },
  });
};
