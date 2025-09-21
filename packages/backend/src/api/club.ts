import express from "express";
import authMiddleware from "./auth-middleware";
import { getSession } from "@auth/express";
import { authConfig } from "./auth/auth-config";
import { PrismaClient, ClubRole } from "../generated/prisma";

const clubRouter = express.Router();
const prisma = new PrismaClient();

clubRouter.use(authMiddleware);

clubRouter.get("/:slug", async (_req, res) => {
  try {
    const { slug } = _req.params;
    const session = await getSession(_req, authConfig);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!slug) {
      return res.status(400).json({ error: "Club slug is required" });
    }

    // Check if user is a member of the club
    const membership = await prisma.clubMembership.findFirst({
      where: {
        club: {
          slug,
        },
        user: {
          email: session.user.email,
        },
      },
    });

    const isMember = membership !== null;

    if (!isMember) {
      return res.status(403).json({
        error: "Unauthorized: You are not a member of this club",
      });
    }

    // Get club details
    const clubDetails = await prisma.club.findFirst({
      where: {
        slug,
      },
    });

    if (!clubDetails) {
      return res.status(404).json({ error: "Club not found" });
    }

    // Get admin memberships for this club
    const adminMemberships = await prisma.clubMembership.findMany({
      where: {
        clubSlug: clubDetails.slug,
        clubRole: ClubRole.CLUB_ADMIN,
      },
    });

    // Get user details for admin members
    const adminDetails = await Promise.all(
      adminMemberships.map(async (membership) => {
        const user = await prisma.user.findUnique({
          where: {
            email: membership.userEmail,
          },
          select: {
            name: true,
            email: true,
          },
        });
        return {
          name: user?.name || null,
          email: membership.userEmail,
          clubrole: membership.clubRole,
        };
      })
    );

    res.json({
      club_name: clubDetails.name,
      description: clubDetails.description,
      admins: adminDetails,
    });
  } catch (error) {
    console.error("Error checking club membership:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default clubRouter;
