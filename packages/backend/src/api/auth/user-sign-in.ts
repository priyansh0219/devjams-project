import type { User } from "@auth/express";
import type { AdapterUser } from "@auth/express/adapters";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const handleUserSignIn = async (user: User | AdapterUser) => {
  if (!user.email) return false;
  await prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: user.name,
    },
    create: {
      email: user.email,
      name: user.name,
    },
  });

  return true;
};
