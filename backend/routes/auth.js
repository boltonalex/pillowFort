const express = require("express");
const router = express.Router();
const { getAuth } = require("firebase-admin/auth");
const admin = require("../firebase");

// ✅ Sign in with email & password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(user.uid);
    res.json({ token, userId: user.uid });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// ✅ Sign up with email & password
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().createUser({ email, password });
    const token = await admin.auth().createCustomToken(user.uid);
    res.json({ token, userId: user.uid });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Verify Firebase ID Token (Middleware)
router.post("/verify", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    res.json({ userId: decodedToken.uid });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ error: "Unauthorized" });
  }
});

module.exports = router;