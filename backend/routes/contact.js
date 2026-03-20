import express from "express";

const router = express.Router();

// In-memory store for messages (replace with database in production)
const messages = [];

// Send contact message
router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format"
    });
  }

  // Store message
  const newMessage = {
    id: Date.now(),
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
    read: false
  };

  messages.push(newMessage);

  // Log to console (replace with email service)
  console.log("\n✉️  New Contact Message Received:");
  console.log("───────────────────────────────");
  console.log(`From: ${name} <${email}>`);
  console.log(`Subject: ${subject}`);
  console.log(`\n${message}`);
  console.log("───────────────────────────────\n");

  res.status(200).json({
    success: true,
    message: "Message received! I'll get back to you soon.",
    data: {
      id: newMessage.id,
      timestamp: newMessage.timestamp
    }
  });
});

// Get all messages (for admin panel)
router.get("/messages", (req, res) => {
  res.json({
    success: true,
    data: messages,
    total: messages.length
  });
});

export default router;
