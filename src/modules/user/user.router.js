import { Router } from "express";
import * as controller from "./user.controller.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";
const router = Router();
// 1-signUp
router.post("/signUp", asyncHandler(controller.signUp));
// 2-login-->with create token
router.post("/login", asyncHandler(controller.login));
export default router;
