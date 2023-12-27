// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    username: "admin",
    password: "admin",
    favourites: new Map(),
    sessionId: "",
  },
  {
    id: 2,
    username: "user",
    password: "user",
    favourites: new Map(),
    sessionId: "",
  },
];

app.get("/ads/category", async (req, res) => {
  try {
    const id = req.query.id;
    const apiUrl = `https://wiki-ads.onrender.com/ads?category=${id}`;
    const response = await fetch(apiUrl);
    res.json(await response.json());
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
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  loginService(username, password, res);
});

app.put("/favourites", async (req, res) => {
  addToFavouritesService(req.body, res);
});

app.get("/favourites", async (req, res) => {
  const { username, sessionId } = req.query;
  favouritesRetrievalService(username, sessionId, res);
});

app.delete("/favourites", async (req, res) => {
  removeFromFavouritesService(req.body, res);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function favouritesRetrievalService(username, sessionId, res) {
  const user = users.find((user) => user.username === username);
  if (user && user.sessionId === sessionId) {
    // create an array from the map.
    const favourites = Array.from(user.favourites.values());
    res.json(response(200, "Success", "", favourites));
  } else {
    res.json(response(401, "Invalid credentials"));
  }
}

function loginService(username, password, res) {
  const user = users.find((user) => user.username === username);
  if (user && user.password === password) {
    user.sessionId = uuidv4();
    res.json(
      response(
        200,
        "Login Success",
        user.sessionId,
        Array.from(user.favourites.values())
      )
    );
  } else {
    res.json(response(401, "Invalid credentials"));
  }
}

function addToFavouritesService(data, res) {
  const { username, sessionId, ad } = data;
  const user = users.find((user) => user.username === username);
  if (user && user.sessionId === sessionId) {
    if (user.favourites.has(ad.id)) {
      res.json(response(409, "Favourite already exists"));
    } else {
      user.favourites.set(ad.id, ad);
      console.log(user.favourites);
      res.json(
        response(
          200,
          "Favourite added",
          "",
          Array.from(user.favourites.values())
        )
      );
    }
  } else {
    res.json(
      response(401, "Παρακαλώ συνδεθείτε για προσθήκη στη λίστα αγαπημένων")
    );
  }
}

function removeFromFavouritesService(data, res) {
  const { username, sessionId, ad } = data;
  const user = users.find((user) => user.username === username);
  if (user && user.sessionId === sessionId) {
    if (user.favourites.has(ad.id)) {
      user.favourites.delete(ad.id);
      res.json(
        response(
          200,
          "Favourite removed",
          "",
          Array.from(user.favourites.values())
        )
      );
    } else {
      res.json(response(404, "Favourite not found"));
    }
  } else {
    res.json(response(401, "Invalid credentials"));
  }
}

function response(code, message, sessionId = "", data = {}) {
  return {
    code,
    message,
    sessionId,
    data,
  };
}
