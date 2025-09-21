import { Router } from "express";
import { PrismaClient } from "../generated/prisma";
import authMiddleware from "./auth-middleware";
import { getSession } from "@auth/express";
import { authConfig } from "./auth/auth-config";

const prisma = new PrismaClient();
const myClubsRouter = Router();

myClubsRouter.use(authMiddleware);

// GET /api/my-clubs - Get all clubs user has joined with their roles
myClubsRouter.get("/", async (req, res) => {
  try {
    const session = await getSession(req, authConfig);

    // Fetch all club memberships for the user including club details and role
    const userClubs = await prisma.clubMembership.findMany({
      where: {
        userEmail: session!.user!.email!,
      },
      include: {
        club: {
          select: {
            slug: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Transform the data to include role information
    const clubsWithRoles = userClubs.map((membership) => ({
      club: membership.club,
      role: membership.clubRole,
      joinedAt: membership.createdAt,
    }));

    res.json({
      clubs: clubsWithRoles,
      total: clubsWithRoles.length,
    });
  } catch (error) {
    console.error("Error fetching user clubs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default myClubsRouter;
