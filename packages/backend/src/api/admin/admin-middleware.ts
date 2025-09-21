import type { Request, Response, NextFunction } from "express";
import { getSession } from "@auth/express";
import { authConfig } from "../auth/auth-config";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get session using auth/express
  const session = await getSession(req, authConfig);

  // Check if user is authenticated
  if (!session?.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user has site_admin role
  if ((session.user as any).siteRole !== "SITE_ADMIN") {
    return res.status(403).json({ error: "Site admin access required" });
  }

  next();
};

export default adminMiddleware;
