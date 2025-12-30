import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false, // Use true for port 465, false for port 587
   auth: {
      user: process.env.APP_USER,
      pass: process.env.APP_PASS,
   },
});

export const auth = betterAuth({
   database: prismaAdapter(prisma, {
      provider: "postgresql",
   }),

   trustedOrigins: [process.env.APP_URL!],

   user: {
      additionalFields: {
         role: {
            type: "string",
            defaultValue: "USER",
            required: false,
         },
         phone: {
            type: "string",
            required: false,
         },
         status: {
            type: "string",
            defaultValue: "ACTIVE",
            required: false,
         },
      },
   },

   emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: true,
   },

   emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url, token }, request) => {
         try {
            const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

            const info = await transporter.sendMail({
               from: '"Prisma Blog" <prismablog@pr.com>',
               to: user.email,
               subject: "Please verify your email",
               html: `
               <!DOCTYPE html>
               <html lang="en">
               <head>
               <meta charset="UTF-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
               <title>Verify Your Email</title>
               </head>
               <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

               <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
                  <tr>
                  <td align="center">
                     <table width="100%" max-width="600" cellpadding="0" cellspacing="0"
                        style="background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">

                        <!-- Header -->
                        <tr>
                        <td align="center" style="padding-bottom:20px;">
                           <h1 style="margin:0; color:#111827;">Prisma Blog Application</h1>
                        </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                        <td style="color:#374151; font-size:16px; line-height:1.6;">
                           <p>Hi ${user.name}</p>

                           <p>
                              Thank you for creating an account on <strong>Prisma Blog Application</strong>.
                              Please verify your email address by clicking the button below.
                           </p>

                           <div style="text-align:center; margin:30px 0;">
                              <a href="${verificationUrl}"
                                 style="background-color:#2563eb; color:#ffffff; text-decoration:none;
                                       padding:14px 28px; border-radius:6px; font-weight:bold; display:inline-block;">
                              Verify Email
                              </a>
                           </div>

                           <p>
                              If the button doesn’t work, copy and paste this link into your browser:
                           </p>

                           <p style="word-break:break-all; color:#2563eb;">
                              ${verificationUrl}
                           </p>

                           <p>
                              This link will expire soon for security reasons.
                           </p>

                           <p style="margin-top:30px;">
                              Thanks,<br/>
                              <strong>Blog Application Team</strong>
                           </p>
                        </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                        <td align="center" style="padding-top:30px; font-size:12px; color:#9ca3af;">
                           <p>
                              If you didn’t create an account, you can safely ignore this email.
                           </p>
                           <p>© 2025 Prisma Blog Application. All rights reserved.</p>
                        </td>
                        </tr>

                     </table>
                  </td>
                  </tr>
               </table>

               </body>
               </html>            
            `,
            });

            console.log("Message sent:", info.messageId);

         } catch (error) {
            console.error(error);
            throw error;
         }
      },
   },
});
