import rateLimit from "express-rate-limit";

// Rate limiter pour l'authentification (plus restrictif)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: "Trop de tentatives, veuillez réessayer après 15 minutes",
  standardHeaders: true, // Retourne l'info dans `RateLimit-*` headers
  legacyHeaders: false, // Désactiver les headers `X-RateLimit-*`
  skip: (req) => process.env.NODE_ENV !== "production", // Désactiver en dev
});

// Rate limiter pour les vérifications d'email/username (modéré)
export const checkLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 tentatives par IP
  message: "Trop de vérifications, veuillez réessayer après 5 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== "production",
});

// Rate limiter général (plus permissif)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: "Trop de requêtes, veuillez réessayer après 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== "production",
});
