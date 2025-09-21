import express from "express";
import { getSession } from "@auth/express";
import { authConfig } from "./auth/auth-config";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Middleware to check if user is authenticated and has SITE_ADMIN role
const authMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Get session from auth
    const session = await getSession(req, authConfig);

    if (!session || !session.user?.email) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { siteRole: true, email: true, name: true },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User does not exist in database",
      });
    }

    // Attach user info to request for use in route handlers
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to verify authentication.",
    });
  }
};

export default authMiddleware;