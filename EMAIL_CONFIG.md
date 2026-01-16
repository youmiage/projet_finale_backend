# Configuration Email pour Réinitialisation de Mot de Passe

## Vue d'ensemble

Le système de réinitialisation de mot de passe utilise **Nodemailer** pour envoyer des emails à vos utilisateurs.

## Configuration selon le service email

### 1. **Gmail** (le plus simple pour tester)

#### Étapes :

1. Allez sur : https://myaccount.google.com/apppasswords
2. Sélectionnez **Mail** et **Windows Computer**
3. Copiez le mot de passe généré (16 caractères)
4. Mettez à jour votre `.env` :
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=votre_email@gmail.com
   EMAIL_PASSWORD=xxxxxxxxxxxxxxxx  (mot de passe d'application)
   ```

### 2. **Outlook/Hotmail**

```env
EMAIL_SERVICE=outlook
EMAIL_USER=votre_email@outlook.com
EMAIL_PASSWORD=votre_mot_de_passe
```

### 3. **Gmail avec mot de passe classique** (moins sécurisé)

⚠️ Activez d'abord **"Accès aux applications moins sécurisées"** :
https://myaccount.google.com/lesssecureapps

```env
EMAIL_SERVICE=gmail
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe
```

### 4. **SendGrid** (production recommandée)

```env
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxxx  (votre API key SendGrid)
```

[Obtenir une clé SendGrid](https://sendgrid.com)

### 5. **Configuration personnalisée (SMTP)**

Si votre service n'est pas dans la liste, modifiez `emailService.js` :

```javascript
this.transporter = nodemailer.createTransport({
  host: "smtp.votre-service.com",
  port: 587,
  secure: false, // true pour 465, false pour 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## Tester l'envoi d'email

1. Démarrez le backend : `npm start`
2. Appelez POST `/api/auth/forgot-password` avec un email valide
3. Vérifiez les logs pour voir les erreurs Nodemailer
4. Vérifiez votre boîte de réception (ou spam)

## Dépannage

- **"Invalid login" (Gmail)** : Utilisez un mot de passe d'application, pas votre mot de passe normal
- **Pas d'email reçu** : Vérifiez les logs du serveur et le dossier spam
- **Erreur ENOTFOUND** : Vérifiez votre connexion internet et la configuration SMTP

## En production

- Utilisez un service dédié (SendGrid, AWS SES, etc.)
- Ne commitez jamais vos identifiants — utilisez des variables d'environnement sécurisées
- Testez l'envoi en staging avant le déploiement
