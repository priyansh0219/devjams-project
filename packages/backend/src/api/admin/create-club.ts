import { Router } from "express";
import { PrismaClient } from "../../generated/prisma";

const createClubRouter = Router();
const prisma = new PrismaClient();

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// POST /api/admin/create-club
createClubRouter.post("/", async (req, res) => {
  try {
    const { club_name, club_description, admin_email } = req.body;

    // Validate required fields
    if (!club_name || !club_description || !admin_email) {
      return res.status(400).json({
        error:
          "Missing required fields: club_name, club_description, admin_email",
      });
    }

    const slug = createSlug(club_name);

    // Check if slug already exists
    const existingClub = await prisma.club.findUnique({
      where: { slug },
    });

    if (existingClub) {
      return res.status(400).json({
        error: "A club with this name already exists",
      });
    }

    // Upsert club admin user
    const clubAdmin = await prisma.user.upsert({
      where: { email: admin_email },
      update: {}, // Don't update existing user data
      create: {
        email: admin_email,
        // Add other required user fields as needed
      },
    });

    // Create the club
    const newClub = await prisma.club.create({
      data: {
        name: club_name,
        slug,
        description: club_description,
      },
    });

    // Create club membership for the admin
    await prisma.clubMembership.create({
      data: {
        userEmail: clubAdmin.email,
        clubSlug: newClub.slug,
        clubRole: "CLUB_ADMIN",
      },
    });

    res.status(201).json({
      message: "Club created successfully",
      club: newClub,
    });
  } catch (error) {
    console.error("Error creating club:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default createClubRouter;
