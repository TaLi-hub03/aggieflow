# Email Notifications Setup Guide

This guide helps you set up email notifications for AggieFlow.

## Option 1: Using Gmail (Recommended for Development)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account](https://myaccount.google.com)
2. Click **Security** in the left sidebar
3. Scroll down to **How you sign in to Google**
4. Enable **2-Step Verification** if not already enabled

### Step 2: Generate an App Password
1. Go back to [Google Account](https://myaccount.google.com)
2. Click **Security** in the left sidebar
3. Scroll down to **App passwords** (only visible if 2FA is enabled)
4. Select **Mail** and **Windows Computer** (or your device)
5. Google will generate a 16-character password
6. Copy this password

### Step 3: Configure .env File
In `/backend/.env`, update:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
FRONTEND_URL=http://localhost:3000
```

**Important:** Never commit `.env` to GitHub. It's already in `.gitignore`.

## Option 2: Using SendGrid (Production)

### Step 1: Create SendGrid Account
1. Sign up at [SendGrid.com](https://sendgrid.com)
2. Create an API key in Settings > API Keys

### Step 2: Update Email Service
Replace the transporter in `services/emailService.js`:
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

### Step 3: Update .env
```
EMAIL_USER=noreply@aggieflow.com
SENDGRID_API_KEY=your-sendgrid-api-key
FRONTEND_URL=https://your-production-url.com
```

## Testing Email Notifications

1. Restart the backend server
2. Go to the Team page
3. Add a new member with a valid email address
4. Check their inbox for the welcome email

## Features Included

- ✅ Welcome email when member is added to team
- ✅ Task assignment email notifications (prepared for implementation)
- ✅ HTML-formatted professional emails
- ✅ Links to AggieFlow app in emails

## Troubleshooting

### Email not sending?
- Check that `EMAIL_USER` and `EMAIL_PASSWORD` are correct in .env
- For Gmail: Ensure App Password is generated (not your regular password)
- Check server logs for errors
- Verify email is not marked as spam

### Gmail App Password issues?
- Make sure 2FA is enabled first
- If app password option doesn't appear, enable it in Security settings
- Use the exact 16-character password without spaces

## Next Steps

To add email notifications for other events (task assignments, event reminders, etc.), import and use the email service functions:

```javascript
const { sendWelcomeEmail, sendTaskAssignmentEmail } = require("../services/emailService");

// Send task assignment email
await sendTaskAssignmentEmail(email, name, taskTitle, assignedByName);
```
