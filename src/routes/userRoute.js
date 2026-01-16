// backend/src/routes/userRoute.js
import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import optionalAuthMiddleware from "../middlewares/optionalAuthMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/* ================== ROUTES PROTÉGÉES ================== */

router.get("/me", authMiddleware, userController.getCurrentUser);

router.put("/me", authMiddleware, userController.updateProfile);

router.put(
  "/me/profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  userController.updateProfilePicture
);

router.put(
  "/me/cover-image",
  authMiddleware,
  upload.single("coverImage"),
  userController.updateCoverImage
);

router.put("/me/password", authMiddleware, userController.changePassword);

router.delete("/me", authMiddleware, userController.deleteAccount);

/* ================== ROUTES PUBLIQUES ================== */

// ⚠️ Toujours APRÈS /me
router.get("/search", authMiddleware, userController.searchUsers);
router.get("/username/:username", optionalAuthMiddleware, userController.getUserByUsername);
router.get("/:id/stats", userController.getUserStats);
router.get("/:id", optionalAuthMiddleware, userController.getUserProfile);

router.get(
  "/suggestions/users",
  authMiddleware,
  userController.getSuggestedUsers
);

export default router;
