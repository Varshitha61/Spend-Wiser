const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    // Skip sending email if credentials are not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`Skipping welcome email for ${userEmail} as SMTP credentials are not configured.`);
      return;
    }

    const mailOptions = {
      from: `"SpendWiser" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'Welcome to SpendWiser!',
      text: `Hello ${userName},\n\nWelcome to SpendWiser! We're excited to have you on board. Start tracking your expenses and managing your budget effectively.\n\nBest regards,\nThe SpendWiser Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to SpendWiser, ${userName}!</h2>
          <p>We're excited to have you on board. Start tracking your expenses and managing your budget effectively.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>The SpendWiser Team</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${userEmail}:`, error);
  }
};

module.exports = {
  sendWelcomeEmail,
};
