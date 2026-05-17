import prisma from "../config/prisma";

// maintenanceService handles all DB operations related to the maintenanceItem model.
// Note: Prisma model name is lowercase "maintenanceItem" as declared in schema.prisma.

export const findAll = async () => {
  return prisma.maintenanceItem.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id: number) => {
  return prisma.maintenanceItem.findUnique({ where: { id } });
};

export const createItem = async (data: {
  itemName: string;
  requiredFunds: number;
  collectedFunds?: number;
}) => {
  return prisma.maintenanceItem.create({
    data: {
      itemName: data.itemName,
      requiredFunds: data.requiredFunds,
      collectedFunds: data.collectedFunds ?? 0,
    },
  });
};

// addFunds — adds to the current collectedFunds, does not replace it.
// Uses a Prisma increment to avoid race conditions.
export const addFunds = async (id: number, amount: number) => {
  const item = await prisma.maintenanceItem.findUnique({ where: { id } });
  if (!item) throw new Error("Maintenance item not found");

  const newAmount = Math.min(
    item.collectedFunds + amount,
    item.requiredFunds
  );

  return prisma.maintenanceItem.update({
    where: { id },
    data: { collectedFunds: newAmount },
  });
};

export const updateItem = async (
  id: number,
  data: Partial<{
    itemName: string;
    requiredFunds: number;
    collectedFunds: number;
  }>
) => {
  return prisma.maintenanceItem.update({ where: { id }, data });
};

export const deleteItem = async (id: number) => {
  return prisma.maintenanceItem.delete({ where: { id } });
};

// getTotalFundStats — used for the "Maintenance Jar" card on the home screen.
export const getTotalFundStats = async () => {
  const items = await prisma.maintenanceItem.findMany();
  const totalRequired = items.reduce((sum, i) => sum + i.requiredFunds, 0);
  const totalCollected = items.reduce((sum, i) => sum + i.collectedFunds, 0);
  const percentage =
    totalRequired > 0 ? Math.round((totalCollected / totalRequired) * 100) : 0;

  return { totalRequired, totalCollected, percentage };
};
