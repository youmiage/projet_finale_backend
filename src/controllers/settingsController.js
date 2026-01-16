// backend/src/controllers/settingsController.js
import settingsService from "../services/settingsService.js";

class SettingsController {
  /**
   * @route   GET /api/settings
   * @desc    Obtenir tous les paramètres de l'utilisateur
   * @access  Private
   */
  async getSettings(req, res) {
    try {
      const userId = req.user.id;
      const settings = await settingsService.getUserSettings(userId);

      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      console.error("Erreur getSettings:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Erreur lors de la récupération des paramètres",
      });
    }
  }

  /**
   * @route   PUT /api/settings/notifications
   * @desc    Mettre à jour les préférences de notifications
   * @access  Private
   */
  async updateNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { email, push, inApp } = req.body;

      const settings = await settingsService.updateNotificationSettings(userId, {
        email,
        push,
        inApp,
      });

      res.status(200).json({
        success: true,
        message: "Préférences de notifications mises à jour",
        data: settings.notifications,
      });
    } catch (error) {
      console.error("Erreur updateNotifications:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Erreur lors de la mise à jour des notifications",
      });
    }
  }

  /**
   * @route   PUT /api/settings/privacy
   * @desc    Mettre à jour les paramètres de confidentialité
   * @access  Private
   */
  async updatePrivacy(req, res) {
    try {
      const userId = req.user.id;
      const {
        whoCanFollowMe,
        whoCanSeeMyPosts,
        whoCanMentionMe,
        showOnlineStatus,
        showActivityStatus,
        allowDirectMessages,
      } = req.body;

      const settings = await settingsService.updatePrivacySettings(userId, {
        whoCanFollowMe,
        whoCanSeeMyPosts,
        whoCanMentionMe,
        showOnlineStatus,
        showActivityStatus,
        allowDirectMessages,
      });

      res.status(200).json({
        success: true,
        message: "Paramètres de confidentialité mis à jour",
        data: settings.privacy,
      });
    } catch (error) {
      console.error("Erreur updatePrivacy:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Erreur lors de la mise à jour de la confidentialité",
      });
    }
  }

  /**
   * @route   PUT /api/settings/display
   * @desc    Mettre à jour les préférences d'affichage
   * @access  Private
   */
  async updateDisplay(req, res) {
    try {
      const userId = req.user.id;
      const { theme, language, fontSize, showSensitiveContent } = req.body;

      const settings = await settingsService.updateDisplaySettings(userId, {
        theme,
        language,
        fontSize,
        showSensitiveContent,
      });

      res.status(200).json({
        success: true,
        message: "Préférences d'affichage mises à jour",
        data: settings.display,
      });
    } catch (error) {
      console.error("Erreur updateDisplay:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Erreur lors de la mise à jour de l'affichage",
      });
    }
  }

  /**
   * @route   PUT /api/settings/content
   * @desc    Mettre à jour les préférences de contenu
   * @access  Private
   */
  async updateContent(req, res) {
    try {
      const userId = req.user.id;
      const { autoplayVideos, showMediaPreviews, enableMentions } = req.body;

      const settings = await settingsService.updateContentSettings(userId, {
        autoplayVideos,
        showMediaPreviews,
        enableMentions,
      });

      res.status(200).json({
        success: true,
        message: "Préférences de contenu mises à jour",
        data: settings.content,
      });
    } catch (error) {
      console.error("Erreur updateContent:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Erreur lors de la mise à jour du contenu",
      });
    }
  }

  /**
   * @route   PUT /api/settings
   * @desc    Mettre à jour tous les paramètres (mise à jour globale)
   * @access  Private
   */
  async updateAllSettings(req, res) {
    try {
      const userId = req.user.id;
      const { notifications, privacy, display, content } = req.body;

      let settings = await settingsService.getUserSettings(userId);

      if (notifications) {
        await settingsService.updateNotificationSettings(userId, notifications);
      }

      if (privacy) {
        await settingsService.updatePrivacySettings(userId, privacy);
      }

      if (display) {
        await settingsService.updateDisplaySettings(userId, display);
      }

      if (content) {
        await settingsService.updateContentSettings(userId, content);
      }

      // Récupérer les paramètres mis à jour
      settings = await settingsService.getUserSettings(userId);

      res.status(200).json({
        success: true,
        message: "Paramètres mis à jour avec succès",
        data: settings,
      });
    } catch (error) {
      console.error("Erreur updateAllSettings:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Erreur lors de la mise à jour des paramètres",
      });
    }
  }

  /**
   * @route   POST /api/settings/reset
   * @desc    Réinitialiser tous les paramètres aux valeurs par défaut
   * @access  Private
   */
  async resetSettings(req, res) {
    try {
      const userId = req.user.id;
      const settings = await settingsService.resetToDefault(userId);

      res.status(200).json({
        success: true,
        message: "Paramètres réinitialisés aux valeurs par défaut",
        data: settings,
      });
    } catch (error) {
      console.error("Erreur resetSettings:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Erreur lors de la réinitialisation des paramètres",
      });
    }
  }

  /**
   * @route   GET /api/settings/check-permission/:targetUserId
   * @desc    Vérifier si l'utilisateur actuel peut voir le contenu d'un autre utilisateur
   * @access  Private
   */
  async checkViewPermission(req, res) {
    try {
      const viewerId = req.user.id;
      const { targetUserId } = req.params;

      const canView = await settingsService.canViewContent(viewerId, targetUserId);

      res.status(200).json({
        success: true,
        data: {
          canView,
          targetUserId,
        },
      });
    } catch (error) {
      console.error("Erreur checkViewPermission:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification des permissions",
      });
    }
  }

  /**
   * @route   GET /api/settings/check-mention/:targetUserId
   * @desc    Vérifier si l'utilisateur actuel peut mentionner un autre utilisateur
   * @access  Private
   */
  async checkMentionPermission(req, res) {
    try {
      const mentionerId = req.user.id;
      const { targetUserId } = req.params;

      const canMention = await settingsService.canMentionUser(mentionerId, targetUserId);

      res.status(200).json({
        success: true,
        data: {
          canMention,
          targetUserId,
        },
      });
    } catch (error) {
      console.error("Erreur checkMentionPermission:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification des permissions de mention",
      });
    }
  }
}

export default new SettingsController();
