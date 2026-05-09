import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    service,
    budget,
    message,
    country,
    currency
  } = req.body || {};

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Not provided";

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ success: false, error: "Missing email credentials" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `NexaGrow <${process.env.EMAIL_USER}>`,
      replyTo: email || undefined,
      to: process.env.EMAIL_USER,
      subject: "New Contact from NexaGrow",
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email || "Not provided"}</p>
        <p><b>Phone:</b> ${phone || "Not provided"}</p>
        <p><b>Company:</b> ${company || "Not provided"}</p>
        <p><b>Service:</b> ${service || "Not specified"}</p>
        <p><b>Budget:</b> ${budget || "Not specified"}</p>
        <p><b>Country:</b> ${country || "Not specified"}</p>
        <p><b>Currency:</b> ${currency || "Not specified"}</p>
        <p><b>Message:</b> ${message || "No message provided"}</p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    return res.status(500).json({ success: false });
  }
}
