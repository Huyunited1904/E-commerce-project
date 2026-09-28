import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async ({
  email,
  fullName,
  token,
}) => {
  const verificationUrl =
    `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"E-commerce Project" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your email address",

    html: `
      <h2>Hello ${fullName},</h2>

      <p>Thank you for creating an account.</p>

      <p>Please click the button below to verify your email:</p>

      <a href="${verificationUrl}">
        Verify email
      </a>

      <p>This link will expire in 30 minutes.</p>
    `,
  });
};