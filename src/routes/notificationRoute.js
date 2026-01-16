import express from "express"
import notificationController from "../controllers/notificationController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware, notificationController.getNotifications)
router.put("/:id/read", authMiddleware, notificationController.markOneAsRead)
router.put("/read-all", authMiddleware, notificationController.markAllAsRead)
router.get("/unread-count", authMiddleware, notificationController.getUnreadCount)

export default router;
