import express from "express";
import { createContact, getContacts } from "../controllers/contactController.js";

const router = express.Router();

// POST contact form
router.post("/", createContact);

// GET all contact messages
router.get("/", getContacts);

export default router;