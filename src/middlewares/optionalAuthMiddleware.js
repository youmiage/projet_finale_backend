import jwt from "jsonwebtoken"
import User from "../models/User.js"

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next()
    }

    const token = authHeader.substring(7)

    if (!token) {
      return next()
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id)

      if (user) {
        req.user = {
          id: user._id,
          username: user.username,
          email: user.email,
        }
      }
    } catch (error) {
      console.log("Token invalide ou expiré, continuant sans authentification")
    }

    next()
  } catch (error) {
    console.error("Erreur optionalAuthMiddleware:", error)
    next()
  }
}

export default optionalAuthMiddleware
