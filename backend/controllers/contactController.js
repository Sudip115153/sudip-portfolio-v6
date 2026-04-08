import dotenv from "dotenv";
dotenv.config();

import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

// Debug check
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔐 EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

// Create transporter INSIDE function-safe style
const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// @desc    Save contact form + send auto reply
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Save in MongoDB
    const newContact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    // Terminal log
    console.log("\n==============================");
    console.log("📩 NEW CONTACT FORM SUBMISSION");
    console.log("==============================");
    console.log(`👤 Name   : ${name}`);
    console.log(`📧 Email  : ${email}`);
    console.log(`📝 Subject: ${subject}`);
    console.log(`💬 Message: ${message}`);
    console.log(`🕒 Time   : ${new Date().toLocaleString()}`);
    console.log("==============================\n");

    // Create transporter AFTER env is loaded
    const transporter = getTransporter();

    // Auto-reply email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting Sudip Chatterjee",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
          <h2 style="color: #00d4ff;">Thank You for Contacting Me!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for reaching out through my portfolio website.</p>
          <p>I have received your message regarding:</p>
          <p><strong>${subject}</strong></p>
          <p>I will review your message and get back to you as soon as possible.</p>
          <hr />
          <p><strong>Your Message:</strong></p>
          <p style="background:#f4f4f4; padding:10px; border-radius:8px;">${message}</p>
          <br />
          <p>Best regards,</p>
          <p><strong>Sudip Chatterjee</strong><br/>MCA Fresher | Java Developer Aspirant</p>
        </div>
      `
    };

    // Admin notification email to you
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
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
    };

    // Send mails
    try {
      const userInfo = await transporter.sendMail(userMailOptions);
      console.log("✅ Auto-reply email sent successfully!");
      console.log("📨 User Mail Response:", userInfo.response);

      const adminInfo = await transporter.sendMail(adminMailOptions);
      console.log("✅ Admin notification email sent!");
      console.log("📨 Admin Mail Response:", adminInfo.response);
    } catch (mailError) {
      console.log("❌ Email sending failed!");
      console.log("📛 Mail Error:", mailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newContact
    });
  } catch (error) {
    console.error("❌ Contact submission error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while saving contact message",
      error: error.message
    });
  }
};

// @desc    Get all contacts
// @route   GET /api/contact
// @access  Public
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