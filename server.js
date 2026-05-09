require("dotenv").config({ path: "process.env" });

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve your website
app.use(express.static(__dirname));

// 📩 EMAIL CONFIG (FIXED SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS  // app password
  }
});

// 📩 SEND EMAIL ROUTE
app.post("/send-email", async (req, res) => {
  console.log("📩 Request received:", req.body);

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

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Not provided";

  try {
    await transporter.sendMail({
      from: `NexaGrow <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: "New Contact from NexaGrow",
      html: `
        <h2>📩 New Contact Message</h2>
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

    console.log("✅ Email sent successfully");
    res.json({ success: true });

  } catch (error) {
    console.log("❌ ERROR:", error);
    res.json({ success: false });
  }
});

// ✅ Fix homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "nexagrow.html"));
});

// 🚀 Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});