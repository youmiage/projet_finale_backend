import jwt from "jsonwebtoken";
import User from "../models/User.js";

class AuthService {
  /**
   * Générer un token JWT
   */
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }

  /**
   * Vérifier un token JWT
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Token invalide ou expiré");
    }
  }

  /**
   * Inscription
   */
  async register(userData) {
    try {
      const { username, email, password, name } = userData;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username }],
      });

      if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
          const error = new Error("Cet email est déjà utilisé");
          error.statusCode = 400;
          throw error;
        }
        if (existingUser.username === username) {
          const error = new Error("Ce nom d'utilisateur est déjà pris");
          error.statusCode = 400;
          throw error;
        }
      }

      // Créer l'utilisateur directement (le password sera hashé automatiquement)
      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password,
        name: name || username,
      });

      // Générer le token
      const token = this.generateToken(user._id);

      return {
        token,
        user: user.getPublicProfile(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Connexion
   */
  async login(email, password) {
    try {
      // Trouver l'utilisateur avec le mot de passe
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        "+password"
      );

      if (!user) {
        const error = new Error("Email ou mot de passe incorrect");
        error.statusCode = 401;
        throw error;
      }

      // Vérifier le mot de passe
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        const error = new Error("Email ou mot de passe incorrect");
        error.statusCode = 401;
        throw error;
      }

      // Générer le token
      const token = this.generateToken(user._id);

      return {
        token,
        user: user.getPublicProfile(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtenir l'utilisateur à partir du token
   */
  async getUserFromToken(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await User.findById(decoded.id);

      if (!user) {
        const error = new Error("Utilisateur non trouvé");
        error.statusCode = 404;
        throw error;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
