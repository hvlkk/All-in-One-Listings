// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());

app.get("/ads/category", async (req, res) => {
  try {
    const id = req.query.id;
    const apiUrl = `https://wiki-ads.onrender.com/ads?category=${id}`;
    const response = await fetch(apiUrl);
    res.json(await response.json());
    console.log(response);
  } catch (err) {
    console.log(err);
  }
});

app.get("/ads/subcategory", async (req, res) => {
  try {
    const id = req.query.id;
    const apiUrl = `https://wiki-ads.onrender.com/ads?subcategory=${id}`;
    const response = await fetch(apiUrl);
    res.json(await response.json());
    console.log(response);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function loginService(username, password) {}
