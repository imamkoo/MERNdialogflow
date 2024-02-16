const express = require("express");
const { SessionsClient } = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const auth = require("../middleware/auth");
const Chat = require("../models/Chat");
const router = express.Router();

router.post("/send-message", auth, async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id; // Diperoleh dari middleware auth

  const projectId = process.env.GOOGLE_PROJECT_ID;
  const sessionId = uuid.v4();
  const languageCode = "id";
  const sessionClient = new SessionsClient({
    credentials: {
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: languageCode,
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    const chat = new Chat({
      userId,
      question: text,
      answer: result.fulfillmentText,
    });
    await chat.save();
    res.json({ reply: result.fulfillmentText });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).send({ error: "Error processing your request" });
  }
});

router.get("/history", auth, async (req, res) => {
  try {
    const userId = req.user.id; // Diperoleh dari middleware auth
    const chats = await Chat.find({ userId }).sort({ date: 1 }); // Asumsi model Chat Anda memiliki field userId
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to get chat history." });
  }
});

module.exports = router;
