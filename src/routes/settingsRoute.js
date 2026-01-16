// backend/src/routes/settingsRoute.js
import express from "express";
import settingsController from "../controllers/settingsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Toutes les routes de paramètres sont protégées
router.use(authMiddleware);

/**
 * @route   GET /api/settings
 * @desc    Obtenir tous les paramètres de l'utilisateur
 * @access  Private
 */
router.get("/", settingsController.getSettings);

/**
 * @route   PUT /api/settings/notifications
 * @desc    Mettre à jour les préférences de notifications
 * @access  Private
 * @body    {
 *          email: {
 *            newFollower: Boolean,
 *            followRequest: Boolean,
 *            followAccepted: Boolean,
 *            threadLike: Boolean,
 *            threadReply: Boolean,
 *            mention: Boolean
 *          },
 *          push: { ... même structure ... },
 *          inApp: { ... même structure ... }
 *        }
 */
router.put("/notifications", settingsController.updateNotifications);

/**
 * @route   PUT /api/settings/privacy
 * @desc    Mettre à jour les paramètres de confidentialité
 * @access  Private
 * @body    {
 *          whoCanFollowMe: "everyone" | "friends_of_friends" | "nobody",
 *          whoCanSeeMyPosts: "everyone" | "followers" | "only_me",
 *          whoCanMentionMe: "everyone" | "followers" | "nobody",
 *          showOnlineStatus: Boolean,
 *          showActivityStatus: Boolean,
 *          allowDirectMessages: "everyone" | "followers" | "people_i_follow" | "nobody"
 *        }
 */
router.put("/privacy", settingsController.updatePrivacy);

/**
 * @route   PUT /api/settings/display
 * @desc    Mettre à jour les préférences d'affichage
 * @access  Private
 * @body    {
 *          theme: "light" | "dark" | "auto",
 *          language: "fr" | "ar" | "en",
 *          fontSize: "small" | "medium" | "large",
 *          showSensitiveContent: Boolean
 *        }
 */
router.put("/display", settingsController.updateDisplay);

/**
 * @route   PUT /api/settings/content
 * @desc    Mettre à jour les préférences de contenu
 * @access  Private
 * @body    {
 *          autoplayVideos: Boolean,
 *          showMediaPreviews: Boolean,
 *          enableMentions: Boolean
 *        }
 */
router.put("/content", settingsController.updateContent);

/**
 * @route   PUT /api/settings
 * @desc    Mettre à jour tous les paramètres (mise à jour globale)
 * @access  Private
 * @body    {
 *          notifications: { ... },
 *          privacy: { ... },
 *          display: { ... },
 *          content: { ... }
 *        }
 */
router.put("/", settingsController.updateAllSettings);

/**
 * @route   POST /api/settings/reset
 * @desc    Réinitialiser tous les paramètres aux valeurs par défaut
 * @access  Private
 */
router.post("/reset", settingsController.resetSettings);

/**
 * @route   GET /api/settings/check-permission/:targetUserId
 * @desc    Vérifier si l'utilisateur actuel peut voir le contenu d'un autre utilisateur
 * @access  Private
 * @param   targetUserId - ID de l'utilisateur cible
 */
router.get("/check-permission/:targetUserId", settingsController.checkViewPermission);

/**
 * @route   GET /api/settings/check-mention/:targetUserId
 * @desc    Vérifier si l'utilisateur actuel peut mentionner un autre utilisateur
 * @access  Private
 * @param   targetUserId - ID de l'utilisateur cible
 */
router.get("/check-mention/:targetUserId", settingsController.checkMentionPermission);

export default router;
