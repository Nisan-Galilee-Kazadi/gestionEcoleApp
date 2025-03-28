const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER, // Votre adresse Gmail
        pass: process.env.SMTP_PASS  // Votre mot de passe Gmail ou mot de passe d'application
    }
});

transporter.verify(function(error, success) {
    if (error) {
        console.error("❌ Erreur de connexion au serveur SMTP:", error);
    } else {
        console.log("✅ Connexion au serveur SMTP établie avec succès");
    }
});

// Fonction pour générer un userId
exports.generateUserId = (name) => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${cleanName}.${year}${random}`;
};

// Fonction pour générer un mot de passe temporaire
exports.generateTempPassword = () => {
    return Math.random().toString(36).slice(-10);
};

// Fonction pour envoyer les credentials par email
exports.sendCredentialsMail = async (email, { userId, tempPassword, name }) => {
    try {
        console.log('📧 Préparation de l\'email pour:', email);
        console.log('⚙️ Options de l\'email:', { userId, tempPassword, name });

        const mailOptions = {
            from: '"Admin CICAF" <admin@cicaf.com>',
            to: email,
            subject: 'Vos identifiants de connexion CICAF',
            html: `
                <h2>Bienvenue ${name}</h2>
                <p>Voici vos identifiants de connexion :</p>
                <p><strong>Identifiant :</strong> ${userId}</p>
                <p><strong>Mot de passe temporaire :</strong> ${tempPassword}</p>
                <p>Veuillez changer votre mot de passe lors de votre première connexion.</p>
            `
        };

        console.log('✉️ Envoi de l\'email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email envoyé:', info.messageId);

    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
        throw error; // Relancer l'erreur pour la gérer dans le contrôleur
    }
};