const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Branded + Flow phone assistant running");
});

// Twilio voice webhook — MUST be strict TwiML
app.post("/twilio/voice", (req, res) => {
  res.set("Content-Type", "text/xml");
  res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Say>Hi, thanks for calling Branded plus Flow. I\'m the assistant. How can I help you today?</Say></Response>');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on port", PORT);
});
