import nodemailer from "nodemailer";

// Configurer le transporter SendGrid
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Fonction pour envoyer un email de réinitialisation
export const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@cineconnect.com",
      to: email,
      subject: "Réinitialisation de votre mot de passe - CineConnect",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
          <div style="background-color: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Réinitialisation de mot de passe</h2>
            
            <p style="color: #666; font-size: 16px;">Bonjour,</p>
            
            <p style="color: #666; font-size: 16px;">Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le bouton ci-dessous pour continuer:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold; 
                        display: inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Ou copiez ce lien:</p>
            <p style="background-color: #f9f9f9; padding: 12px; word-break: break-all; font-size: 12px; color: #999;">
              ${resetLink}
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="color: #999; font-size: 12px;">
              Ce lien expire dans 24 heures.
            </p>
            
            <p style="color: #999; font-size: 12px;">
              Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">© 2026 CineConnect. Tous droits réservés.</p>
          </div>
        </div>
      `,
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès:", info.messageId);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw new Error("Impossible d'envoyer l'email");
  }
};

// Fonction pour envoyer un email de bienvenue
export const sendWelcomeEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@cineconnect.com",
      to: email,
      subject: "Bienvenue sur CineConnect! 🎬",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
          <div style="background-color: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Bienvenue ${username}! 🎬</h2>
            
            <p style="color: #666; font-size: 16px;">Votre compte CineConnect a été créé avec succès.</p>
            
            <p style="color: #666; font-size: 16px;">Commencez à explorer notre catalogue de films dès maintenant!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/login" 
                 style="background-color: #28a745; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold; 
                        display: inline-block;">
                Aller à l'application
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">© 2026 CineConnect. Tous droits réservés.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email de bienvenue envoyé:", info.messageId);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
    // Ne pas bloquer l'inscription si l'email échoue
    return false;
  }
};
