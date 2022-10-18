import { Router } from "express";
import { friendRequestRouter } from "./friendRequestRoute";

const router = Router();

router.use('/friends/requests', friendRequestRouter);

export default router;