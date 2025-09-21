import express from "express";
import { expressAuthConfig } from "./auth-config";

const authRouter = express.Router();

authRouter.use("/*", expressAuthConfig);

export default authRouter;