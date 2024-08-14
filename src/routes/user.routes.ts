import { Router } from "express";
import { getUser } from "../controllers";
import { IUserService } from "../services/interfaces";
import { createUserService } from "../services/factory/services.factory";

export const userServices: IUserService = createUserService();
const router = Router();

router.get("/", getUser);

export default router;
