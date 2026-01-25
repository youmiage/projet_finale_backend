// Importation du service d'authentification
// 👉 Gère l'inscription, la connexion, le hash du mot de passe, les tokens, etc.
import authService from "../services/authService.js";

// Importation du service utilisateur
// 👉 Sert à récupérer un utilisateur, vérifier email/username, etc.
import userService from "../services/userService.js";

// Importation du service de réinitialisation du mot de passe
// 👉 Gère forgotPassword et resetPassword
import passwordResetService from "../services/passwordResetService.js";

// Classe Controller pour l'authentification
// 👉 Le controller reçoit les requêtes HTTP (req)
// 👉 Il appelle les services
// 👉 Il renvoie la réponse HTTP (res)
class AuthController {

  // ==========================
  // 🟢 INSCRIPTION UTILISATEUR
  // ==========================
  async register(req, res, next) {
    try {
      // Affiche les données reçues depuis le frontend (debug)
      console.log("📥 Données reçues pour l'inscription:", req.body);

      // Déstructuration des champs envoyés dans le body
      const { username, email, password, confirmPassword, name } = req.body;

      // Logs individuels pour vérifier chaque champ
      console.log("✅ username:", username);
      console.log("✅ email:", email);

      // On masque les mots de passe dans les logs (sécurité)
      console.log("✅ password:", password ? "***" : undefined);
      console.log("✅ confirmPassword:", confirmPassword ? "***" : undefined);
      console.log("✅ name:", name);

      // Vérification : tous les champs obligatoires doivent exister
      if (!username || !email || !password || !confirmPassword) {
        console.log("❌ Champs manquants détectés");
        return res.status(400).json({
          success: false,
          message: "Veuillez fournir tous les champs requis",
        });
      }

      // Vérification : les deux mots de passe doivent être identiques
      if (password !== confirmPassword) {
        console.log("❌ Les mots de passe ne correspondent pas");
        return res.status(400).json({
          success: false,
          message: "Les mots de passe ne correspondent pas",
        });
      }

      // Tentative de création de l'utilisateur
      console.log("🔄 Tentative de création de l'utilisateur...");

      // Appel au service d'authentification
      // 👉 Le service va :
      // - vérifier si l'email/username existe
      // - hasher le mot de passe
      // - sauvegarder l'utilisateur en base
      // - générer un token (JWT)
      const result = await authService.register({
        username,
        email,
        password,
        name: name, // champ optionnel
      });

      console.log("✅ Utilisateur créé avec succès:", result.user.username);

      // Réponse succès
      return res.status(201).json({
        success: true,
        message: "Inscription réussie",
        data: result,
      });

    } catch (error) {
      // Gestion des erreurs
      console.error("❌ Erreur inscription:", error);

      return res.status(400).json({
        success: false,
        message: error.message || "Erreur lors de l'inscription",
      });
    }
  }

  // ==========================
  // 🔐 CONNEXION UTILISATEUR
  // ==========================
  async login(req, res, next) {
    try {
      // Récupération email et mot de passe
      const { email, password } = req.body;

      // Vérification des champs requis
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Veuillez fournir email et mot de passe",
        });
      }

      // Appel au service login
      // 👉 Vérifie email
      // 👉 Compare mot de passe hashé
      // 👉 Génère token JWT
      const result = await authService.login(email, password);

      return res.status(200).json({
        success: true,
        message: "Connexion réussie",
        data: result,
      });

    } catch (error) {
      console.error("❌ Erreur connexion:", error);

      return res.status(401).json({
        success: false,
        message: error.message || "Email ou mot de passe incorrect",
      });
    }
  }

  // ==========================
  // 👤 PROFIL UTILISATEUR CONNECTÉ
  // ==========================
  async getMe(req, res, next) {
    try {
      // req.user.id est injecté par le middleware d'authentification (JWT)
      const user = await userService.findById(req.user.id);

      return res.status(200).json({
        success: true,
        // getPublicProfile() supprime les infos sensibles (password, tokens...)
        data: user.getPublicProfile(),
      });

    } catch (error) {
      console.error("❌ Erreur getMe:", error);

      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }
  }

  // ==========================
  // 🚪 DÉCONNEXION
  // ==========================
  async logout(req, res, next) {
    try {
      // Si tu utilises JWT, le logout est souvent géré côté frontend
      // (suppression du token)
      return res.status(200).json({
        success: true,
        message: "Déconnexion réussie",
      });

    } catch (error) {
      console.error("❌ Erreur logout:", error);

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la déconnexion",
      });
    }
  }

  // ==========================
  // 👤 VÉRIFIER DISPONIBILITÉ USERNAME
  // ==========================
  async checkUsername(req, res, next) {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({
          success: false,
          message: "Username requis",
        });
      }

      // Vérifie si le username est déjà utilisé
      const result = await userService.checkUsernameAvailability(username);

      return res.status(200).json({
        success: true,
        data: result,
      });

    } catch (error) {
      console.error("❌ Erreur check username:", error);

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification",
      });
    }
  }

  // ==========================
  // 📧 VÉRIFIER DISPONIBILITÉ EMAIL
  // ==========================
  async checkEmail(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email requis",
        });
      }

      const result = await userService.checkEmailAvailability(email);

      return res.status(200).json({
        success: true,
        data: result,
      });

    } catch (error) {
      console.error("❌ Erreur check email:", error);

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification",
      });
    }
  }

  // ==========================
  // 🔁 MOT DE PASSE OUBLIÉ
  // ==========================
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      console.log("📧 Demande de réinitialisation pour:", email);

      // Génère token + envoie email
      const result = await passwordResetService.forgotPassword(email);

      return res.status(200).json({
        success: true,
        message: result.message,

        // En DEV uniquement, on retourne le token (debug)
        ...(process.env.NODE_ENV === "development" && { token: result.token }),
      });

    } catch (error) {
      console.error("❌ Erreur forgot password:", error.message);

      // ⚠️ Sécurité : on ne révèle jamais si l'email existe
      return res.status(200).json({
        success: true,
        message:
          "Si cet email existe, un lien de réinitialisation a été envoyé",
      });
    }
  }

  // ==========================
  // 🔐 RÉINITIALISATION MOT DE PASSE
  // ==========================
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      console.log("🔑 Tentative de réinitialisation de mot de passe");

      // Vérification des champs
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Token et nouveau mot de passe requis",
        });
      }

      // Vérifie token + met à jour le mot de passe
      const result = await passwordResetService.resetPassword(
        token,
        newPassword
      );

      console.log("✅ Mot de passe réinitialisé avec succès");

      return res.status(200).json({
        success: true,
        message: result.message,
      });

    } catch (error) {
      console.error("❌ Erreur reset password:", error.message);

      return res.status(400).json({
        success: false,
        message: error.message || "Token invalide ou expiré",
      });
    }
  }
}

// Export d'une instance du controller
// 👉 Permet d'utiliser directement les méthodes dans les routes
export default new AuthController();
