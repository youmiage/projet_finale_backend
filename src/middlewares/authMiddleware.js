import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé. Token manquant.",
      });
    }

    // Extraire le token
    const token = authHeader.substring(7); // Enlever "Bearer "

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token manquant",
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // IMPORTANT : Appeler next() pour passer au middleware suivant
    next();
  } catch (error) {
    console.error("❌ Erreur authMiddleware:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token invalide",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erreur serveur d'authentification",
    });
  }
};

export default authMiddleware;
