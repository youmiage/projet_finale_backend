import express from "express"
import replyController from "../controllers/replyController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/:threadId", authMiddleware, replyController.createReply)
router.get("/:threadId", replyController.getThreadReplies)
router.delete("/:id", authMiddleware, replyController.deleteReply)

export default router
