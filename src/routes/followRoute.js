import express from "express"
import followController from "../controllers/followController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/:userId/follow", authMiddleware, followController.follow)
router.delete("/:userId/unfollow", authMiddleware, followController.unfollow)
router.delete("/:userId/remove-follower", authMiddleware, followController.removeFollower)
router.post("/:userId/accept", authMiddleware, followController.acceptRequest)
router.post("/:userId/reject", authMiddleware, followController.rejectRequest)
router.get("/pending", authMiddleware, followController.getPendingRequests)
router.get("/:userId/followers", authMiddleware, followController.getFollowers)
router.get("/:userId/following", authMiddleware, followController.getFollowing)

export default router
