const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("Branded + Flow phone assistant running");
});

app.post("/twilio/voice", (req, res) => {
  res.type("text/xml").send(`
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say>Hi, thanks for calling Branded plus Flow. I'm the assistant. How can I help you today?</Say>
    </Response>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log("Listening on", PORT));
