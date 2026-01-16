import { body, validationResult } from "express-validator";

// Middleware pour gérer les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Erreur de validation",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validations pour l'inscription
export const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Le nom d'utilisateur est requis")
    .isLength({ min: 3, max: 30 })
    .withMessage("Le nom d'utilisateur doit contenir entre 3 et 30 caractères")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores"
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Veuillez fournir un email valide")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("La confirmation du mot de passe est requise")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Les mots de passe ne correspondent pas");
      }
      return true;
    }),

  body("name")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Le nom ne peut pas dépasser 50 caractères"),
];

// Validations pour la connexion
export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Veuillez fournir un email valide")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Le mot de passe est requis"),
];

// Validations pour vérifier l'email
export const emailValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Veuillez fournir un email valide")
    .normalizeEmail(),
];

// Validations pour vérifier le username
export const usernameValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Le nom d'utilisateur est requis")
    .isLength({ min: 3, max: 30 })
    .withMessage("Le nom d'utilisateur doit contenir entre 3 et 30 caractères")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores"
    ),
];
/**
 * Validation pour la réinitialisation de mot de passe
 */
export const resetPasswordValidation = [
  body("token")
    .notEmpty()
    .withMessage("Le token de réinitialisation est requis")
    .isString()
    .withMessage("Le token doit être une chaîne de caractères"),

  body("newPassword")
    .notEmpty()
    .withMessage("Le nouveau mot de passe est requis")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
];
