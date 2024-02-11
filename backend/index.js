require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const mongoose = require("mongoose");
const Donation = require("./models/donation");

const app = express();
app.use(bodyParser.json());

const projectId = process.env.GOOGLE_PROJECT_ID;
const sessionId = uuid.v4();
const languageCode = "id";

const config = {
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
};

const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

//Dialogflow
app.post("/send-message", async (req, res) => {
  const { text } = req.body;

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
    res.json({ reply: result.fulfillmentText });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).send({ error: "Error processing your request" });
  }
});

//Donation
app.post("/donate", async (req, res) => {
  const { donorName, amount, message } = req.body;

  const donation = new Donation({
    donorName,
    amount,
    message,
  });

  try {
    await donation.save();
    res.send({ message: "Donation recorded successfully." });
  } catch (error) {
    res.status(500).send({ message: "Error processing your donation." });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//Database MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));
