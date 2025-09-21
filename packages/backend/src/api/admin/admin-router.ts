import express from "express";
import adminMiddleware from "./admin-middleware";
import createClubRouter from "./create-club";

const adminRouter = express.Router();

adminRouter.use(adminMiddleware);

adminRouter.use("/create-club", createClubRouter);

export default adminRouter;