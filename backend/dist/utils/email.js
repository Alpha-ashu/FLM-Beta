"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        const emailContent = generateEmailContent(options.template, options.data);
        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: options.to,
            subject: options.subject,
            html: emailContent.html,
            text: emailContent.text,
        });
        console.log(`Email sent to ${options.to}`);
    }
    catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send email');
    }
};
exports.sendEmail = sendEmail;
const generateEmailContent = (template, data) => {
    switch (template) {
        case 'verify-email':
            return generateVerifyEmailTemplate(data);
        case 'password-reset':
            return generatePasswordResetTemplate(data);
        case 'welcome':
            return generateWelcomeTemplate(data);
        default:
            return {
                html: `<p>${data.message || 'Thank you for using our service!'}</p>`,
                text: data.message || 'Thank you for using our service!',
            };
    }
};
const generateVerifyEmailTemplate = (data) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to FinanceLife! 🎉</h1>
        </div>
        <div class="content">
          <p>Hello ${data.name},</p>
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
          <p>This link will expire in 24 hours for security reasons.</p>
        </div>
        <div class="footer">
          <p>If you didn't create an account with us, please ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} FinanceLife. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
    const text = `
    Welcome to FinanceLife!

    Hello ${data.name},

    Thank you for signing up! Please verify your email address by visiting this link:
    ${data.verificationUrl}

    This link will expire in 24 hours for security reasons.

    If you didn't create an account with us, please ignore this email.

    Best regards,
    The FinanceLife Team
  `;
    return { html, text };
};
const generatePasswordResetTemplate = (data) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello ${data.name},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <a href="${data.resetUrl}" class="button">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
          <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>For security, this request was made from IP: ${data.ip || 'Unknown'}</p>
          <p>&copy; ${new Date().getFullYear()} FinanceLife. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
    const text = `
    Password Reset Request

    Hello ${data.name},

    We received a request to reset your password. Click the link below to reset it:
    ${data.resetUrl}

    This link will expire in 1 hour for security reasons.

    If you didn't request this password reset, please ignore this email.

    For security, this request was made from IP: ${data.ip || 'Unknown'}

    Best regards,
    The FinanceLife Team
  `;
    return { html, text };
};
const generateWelcomeTemplate = (data) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to FinanceLife!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10E584; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #10E584; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .features { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .feature { background: white; padding: 15px; border-radius: 6px; text-align: center; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to FinanceLife! 🎉</h1>
        </div>
        <div class="content">
          <p>Hello ${data.name},</p>
          <p>Congratulations! Your account has been successfully created and verified. You're all set to start managing your finances like a pro!</p>
          
          <div class="features">
            <div class="feature">
              <h3>📊 Analytics</h3>
              <p>Track your spending and get insights</p>
            </div>
            <div class="feature">
              <h3>💰 Budgets</h3>
              <p>Set and manage your financial goals</p>
            </div>
            <div class="feature">
              <h3>📅 Calendar</h3>
              <p>Never miss a payment again</p>
            </div>
            <div class="feature">
              <h3>👥 Friends</h3>
              <p>Split expenses with friends easily</p>
            </div>
          </div>

          <p>Start exploring your dashboard and take control of your financial journey today!</p>
          
          <a href="${process.env.FRONTEND_URL}" class="button">Explore Dashboard</a>
        </div>
        <div class="footer">
          <p>Need help? Contact our support team at support@financelife.com</p>
          <p>&copy; ${new Date().getFullYear()} FinanceLife. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
    const text = `
    Welcome to FinanceLife!

    Hello ${data.name},

    Congratulations! Your account has been successfully created and verified. You're all set to start managing your finances like a pro!

    Key Features:
    - Analytics: Track your spending and get insights
    - Budgets: Set and manage your financial goals
    - Calendar: Never miss a payment again
    - Friends: Split expenses with friends easily

    Start exploring your dashboard and take control of your financial journey today!

    Visit: ${process.env.FRONTEND_URL}

    Need help? Contact our support team at support@financelife.com

    Best regards,
    The FinanceLife Team
  `;
    return { html, text };
};
//# sourceMappingURL=email.js.map