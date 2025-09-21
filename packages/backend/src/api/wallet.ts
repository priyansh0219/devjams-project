import express from "express";
import authMiddleware from "./auth-middleware";
import { getSession } from "@auth/express";
import { authConfig } from "./auth/auth-config";
import { PrismaClient } from "../generated/prisma";

const walletRouter = express.Router();
const prisma = new PrismaClient();

walletRouter.use(authMiddleware);

walletRouter.get("/", async (_req, res) => {
  try {
    const session = await getSession(_req, authConfig);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        user: {
          email: session.user!.email!,
        },
      },
      select: {
        encryptedSeed: true,
        iv: true,
        salt: true,
        publicAddress: true,
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.json(wallet);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

walletRouter.post("/", async (req, res) => {
  try {
    const session = await getSession(req, authConfig);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { encryptedSeed, iv, salt, publicAddress } = req.body;

    if (!encryptedSeed || !iv || !salt || !publicAddress) {
      return res.status(400).json({ error: "Missing required wallet fields" });
    }

    // Check if user already has a wallet
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        user: {
          email: session.user!.email!,
        },
      },
    });

    if (existingWallet) {
      return res
        .status(409)
        .json({ error: "Wallet already exists for this user" });
    }

    // Create new wallet for the user
    const wallet = await prisma.wallet.create({
      data: {
        encryptedSeed,
        iv,
        salt,
        publicAddress,
        user: {
          connect: {
            email: session.user!.email!,
          },
        },
      },
      select: {
        encryptedSeed: true,
        iv: true,
        salt: true,
        publicAddress: true,
      },
    });

    res.status(201).json(wallet);
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default walletRouter;
