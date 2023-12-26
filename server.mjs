// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());

const users = [
  { id: 1, username: "admin", password: "admin", favourites: [] },
  { id: 2, username: "user", password: "user", favourites: [] },
];

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
  const user = loginService(username, password);
  if (user) {
    res.json(response(200, "Login Success", user.favourites));
  } else {
    res.json(response(401, "Invalid credentials"));
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function loginService(username, password) {
  const user = users.find((user) => user.username === username);
  if (user && user.password === password) {
    return user;
  }
  return null;
}

function response(code, message, data = null) {
  return {
    code: code,
    message: message,
    data: data,
  };
}
