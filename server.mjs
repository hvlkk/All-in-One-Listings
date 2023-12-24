// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());

app.get("/category/ads", async (req, res) => {
  console.log("GET /category/ads");
  console.log(req);
  try {
    const apiUrl = "https://wiki-ads.onrender.com/ads?category=1";
    const response = await fetch(apiUrl);
    res.json(await response.json());
    console.log(response);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
