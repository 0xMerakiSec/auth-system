import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;