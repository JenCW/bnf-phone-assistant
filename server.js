import express from "express";

const app = express();

// Twilio posts form-encoded data by default
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Quick sanity check in browser
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// Twilio webhook: https://bnf-phone-assistant.onrender.com/twilio/voice
app.post("/twilio/voice", (req, res) => {
  res.type("text/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    Hi, thanks for calling Branded and Flow.
    I can help book a call or take a message.
    Please say book a call, or leave a message.
  </Say>
  <Gather input="speech" action="/twilio/gather" method="POST" timeout="5"/>
</Response>`);
});

// Handles the result of Gather speech
app.post("/twilio/gather", (req, res) => {
  const speech = String(req.body?.SpeechResult || "").toLowerCase().trim();

  let reply = "Thanks. Please leave your name, phone number, and what you need help with after the beep.";
  let twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${escapeXml(reply)}</Say>
  <Record maxLength="60" playBeep="true" />
  <Say voice="Polly.Joanna">Got it. Thank you. Goodbye.</Say>
</Response>`;

  if (speech.includes("book")) {
    reply = "Great. Please say your full name and the best phone number to text you a booking link after the beep.";
    twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${escapeXml(reply)}</Say>
  <Record maxLength="30" playBeep="true" />
  <Say voice="Polly.Joanna">Perfect. We will text you shortly. Goodbye.</Say>
</Response>`;
  }

  res.type("text/xml");
  res.send(twiml);
});

// Basic error handler (prevents crashing)
app.use((err, req, res, next) => {
  console.error("SERVER_ERROR:", err);
  res.status(500).json({ ok: false });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}