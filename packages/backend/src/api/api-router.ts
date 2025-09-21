import express from "express";
import authRouter from "./auth/auth-router";
import authMiddleware from "./auth-middleware";
import adminRouter from "./admin/admin-router";
import myClubsRouter from "./my-clubs";
import walletRouter from "./wallet";

const apiRouter = express.Router();

// apiRouter.use(authMiddleware);

apiRouter.use("/auth", authRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/my-clubs", myClubsRouter);
apiRouter.use("/wallet", walletRouter);

export default apiRouter;