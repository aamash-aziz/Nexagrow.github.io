import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

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
    } = req.body;

    const fullName =
      [firstName, lastName].filter(Boolean).join(" ") || "Not provided";

    await transporter.sendMail({
      from: `NexaGrow <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: "New Contact from NexaGrow",
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Company:</b> ${company}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Budget:</b> ${budget}</p>
        <p><b>Country:</b> ${country}</p>
        <p><b>Currency:</b> ${currency}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
