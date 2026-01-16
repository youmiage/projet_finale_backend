import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authLimiter, checkLimiter } from "../middlewares/rateLimiter.js";
import passwordResetService from "../services/passwordResetService.js";
import {
  registerValidation,
  loginValidation,
  emailValidation,
  usernameValidation,
  handleValidationErrors,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Routes publiques avec rate limiting et validation
router.post(
  "/register",
  authLimiter,
  registerValidation,
  handleValidationErrors,
  authController.register.bind(authController)
);

router.post(
  "/login",
  authLimiter,
  loginValidation,
  handleValidationErrors,
  authController.login.bind(authController)
);

router.post(
  "/check-username",
  checkLimiter,
  usernameValidation,
  handleValidationErrors,
  authController.checkUsername.bind(authController)
);

router.post(
  "/check-email",
  checkLimiter,
  emailValidation,
  handleValidationErrors,
  authController.checkEmail.bind(authController)
);

router.post(
  "/forgot-password",
  checkLimiter,
  emailValidation,
  handleValidationErrors,
  authController.forgotPassword.bind(authController)
);

router.post(
  "/reset-password",
  authLimiter,
  authController.resetPassword.bind(authController)
);

// Routes protégées
router.get("/me", authMiddleware, authController.getMe.bind(authController));
router.post(
  "/logout",
  authMiddleware,
  authController.logout.bind(authController)
);

export default router;
