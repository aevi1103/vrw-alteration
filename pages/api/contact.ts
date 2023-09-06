import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import { IContactFormData } from "@/lib/types/contact-form";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, email, message } = req.body as IContactFormData;

      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_EMAIL, // Your Gmail address
          pass: process.env.GMAIL_PASSWORD, // Your Gmail password or an app-specific password
        },
      });

      // Define the email data
      const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: process.env.FROM_EMAIL, // Recipient email address
        cc: process.env.CC_EMAIL,
        subject: "VRW Alterations Contact Form",
        // text: "This is a test email from Next.js and Nodemailer using Gmail.",
        html: `<div>
          <p>From: ${name}</p>
          <p>Email: ${email}</p>
          <p>Message: ${message}</p>
        </div>`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      // Return a success response
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while sending the email" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
