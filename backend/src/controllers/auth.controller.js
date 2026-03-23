import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { eq, or } from "drizzle-orm";
import { sendResetPasswordEmail, sendWelcomeEmail } from "../services/email.service.js";

// Fonction de validation du mot de passe
const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    errors: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    }
  };
};

export const register = async (req, res) => {
  const { username, email, password, displayName } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  // Valider le mot de passe
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ 
      message: "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial (@$!%*?&)"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [user] = await db
      .insert(users)
      .values({ 
        username, 
        email, 
        password: hashedPassword,
        displayName: displayName || username
      })
      .returning({ 
        id: users.id, 
        username: users.username, 
        email: users.email,
        displayName: users.displayName,
        avatar: users.avatar
      });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ 
      message: "Utilisateur créé", 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName || user.username,
        avatar: user.avatar || null
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ message: "Email ou username déjà utilisé" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.email, email),
        eq(users.username, email)
      )
    );

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({ 
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName || user.username,
      avatar: user.avatar || null
    }
  });
};

export const getProfile = async (req, res) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        displayName: users.displayName,
        avatar: users.avatar
      })
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      user: {
        ...user,
        displayName: user.displayName || user.username
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateProfile = async (req, res) => {
  const { username, email, displayName, avatar } = req.body;

  try {
    if (email) {
      const [existingEmail] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingEmail && existingEmail.id !== req.user.id) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }
    }

    if (username) {
      const [existingUsername] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));

      if (existingUsername && existingUsername.id !== req.user.id) {
        return res.status(400).json({ message: "Ce nom d'utilisateur est déjà utilisé" });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (displayName !== undefined) updateData.displayName = displayName;
    if (avatar !== undefined) updateData.avatar = avatar;

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, req.user.id))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        displayName: users.displayName,
        avatar: users.avatar
      });

    res.json({
      message: "Profil mis à jour",
      user: {
        ...updatedUser,
        displayName: updatedUser.displayName || updatedUser.username
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  // Valider le nouveau mot de passe
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ 
      message: "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial (@$!%*?&)"
    });
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Mot de passe actuel incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, req.user.id));

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Erreur lors du changement de mot de passe" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email requis" });
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      // Sécurité: ne pas révéler si l'email existe
      return res.status(200).json({ message: "Si l'email existe, vous recevrez un lien de réinitialisation" });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    // Sauvegarder le token et l'expiration
    await db
      .update(users)
      .set({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expiresAt
      })
      .where(eq(users.id, user.id));

    // ✅ ENVOYER EMAIL RÉEL AVEC SENDGRID
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    try {
      await sendResetPasswordEmail(user.email, resetLink);
      
      res.status(200).json({ 
        message: "Email de réinitialisation envoyé. Vérifiez votre boîte mail."
      });
    } catch (emailError) {
      console.error("Erreur email:", emailError);
      res.status(500).json({ 
        message: "Impossible d'envoyer l'email. Essayez plus tard." 
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Erreur lors de la demande de réinitialisation" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token et mot de passe requis" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
  }

  try {
    // Hasher le token reçu pour le comparer avec celui en BDD
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, hashedToken));

    if (!user) {
      return res.status(400).json({ message: "Token invalide" });
    }

    // Vérifier que le token n'a pas expiré
    if (new Date() > new Date(user.resetPasswordExpires)) {
      return res.status(400).json({ message: "Token expiré" });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      })
      .where(eq(users.id, user.id));

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Erreur lors de la réinitialisation" });
  }
};
