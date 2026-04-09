import dotenv from "dotenv";
dotenv.config();

import Contact from "../models/Contact.js";
import { Resend } from "resend";

// ==============================
// Initialize Resend
// ==============================
const resend = new Resend(process.env.RESEND_API_KEY);

// ==============================
// Debug environment variables
// ==============================
console.log("📧 ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "Missing ❌");
console.log("🔐 RESEND_API_KEY:", process.env.RESEND_API_KEY ? "Loaded ✅" : "Missing ❌");

// ==============================
// @desc    Save contact form + send admin email
// @route   POST /api/contact
// @access  Public
// ==============================
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Save to MongoDB first
    const newContact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    // Console log for Render logs
    console.log("\n==============================");
    console.log("📩 NEW CONTACT FORM SUBMISSION");
    console.log("==============================");
    console.log(`👤 Name   : ${name}`);
    console.log(`📧 Email  : ${email}`);
    console.log(`📝 Subject: ${subject}`);
    console.log(`💬 Message: ${message}`);
    console.log(`🕒 Time   : ${new Date().toLocaleString()}`);
    console.log("==============================\n");

    // ==============================
    // Email sending section (Admin only)
    // ==============================
    let emailSent = true;
    let emailErrorMessage = "";

    try {
      const adminResponse = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL,
        subject: `📩 New Portfolio Contact: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
            <h2 style="color: #ff9800;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background:#f4f4f4; padding:10px; border-radius:8px;">${message}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `
      });

      console.log("✅ Admin email sent successfully!");
      console.log("📨 Resend Response:", adminResponse);

      console.log("ℹ️ Auto-reply skipped because Resend test mode only allows sending to your own email.");

    } catch (mailError) {
      emailSent = false;
      emailErrorMessage = mailError.message;

      console.log("❌ Email sending failed!");
      console.log("📛 Mail Error:", mailError.message);
    }

    // ==============================
    // Final response
    // ==============================
    if (emailSent) {
      return res.status(201).json({
        success: true,
        message: "Message saved and admin email sent successfully!",
        emailSent: true,
        autoReplySent: false,
        data: newContact
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "Message saved successfully, but admin email failed.",
        emailSent: false,
        autoReplySent: false,
        emailError: emailErrorMessage,
        data: newContact
      });
    }

  } catch (error) {
    console.error("❌ Contact submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while saving contact message",
      error: error.message
    });
  }
};

// ==============================
// @desc    Get all contacts
// @route   GET /api/contact
// @access  Public
// ==============================
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error("❌ Fetch contacts error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching contacts",
      error: error.message
    });
  }
};
