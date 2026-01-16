//backend/src/routes/threadRoute.js
import express from "express"
import threadController from "../controllers/threadController.js"
import authMiddleware from "../middlewares/authMiddleware.js"
import optionalAuthMiddleware from "../middlewares/optionalAuthMiddleware.js"
import upload from "../middlewares/uploadMiddleware.js"

const router = express.Router()

router.get("/", optionalAuthMiddleware, threadController.getAllThreads)
router.get("/search", optionalAuthMiddleware, threadController.searchThreads)
router.get("/feed", authMiddleware, threadController.getHomeFeed) // Added /feed route for social-based content
router.get("/user/:userId", optionalAuthMiddleware, threadController.getUserThreads)
router.get("/:id", optionalAuthMiddleware, threadController.getThreadById)

// Routes protégées
router.post("/", authMiddleware, upload.single("media"), threadController.createThread)
router.put("/:id", authMiddleware, upload.single("media"), threadController.updateThread)
router.delete("/:id", authMiddleware, threadController.deleteThread)
router.post("/:id/like", authMiddleware, threadController.likeThread)
router.delete("/:id/unlike", authMiddleware, threadController.unlikeThread)

export default router
