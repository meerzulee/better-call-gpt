import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const router = express.Router();

// Get Ephermeral Token for WebRTC
router.get("/session", async (_, res) => {
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-realtime-preview",
      voice: "verse",
    }),
  });
  const data = await r.json();

  res.send(data);
});

// Get Weather
router.get("/weather", async (req, res) => {
  const { location } = req.query;
  const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
  const data = await r.json();
  res.send(data);
});

// Search the Web
router.get("/search", async (req, res) => {
  const { query } = req.query;
  const r = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      api_key: process.env.TAVILY_API_KEY,
      max_results: 3,
    }),
  });
  const data = await r.json();
  res.send(data.results);
});
app.use("/api", router);


ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
