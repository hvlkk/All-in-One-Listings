// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import UserDAO from "./daos/userDAO.js";
import User from "./entities/user.js";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;
const userDAO = new UserDAO();

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function favouritesRetrievalService(username, sessionId, res) {
  const user = await userDAO.authorize(username, sessionId);
  if (user) {
    // create an array from the map.
    res.json(response(200, "Success", "", user.favourites));
  } else {
    res.json(response(401, "Invalid credentials"));
  }
}

async function loginService(username, password, res) {
  const user = new User(await userDAO.login(username, password));
  if (user) {
    return res.json(
      response(200, "Login Success", user.sessionId, user.favourites)
    );
  } else {
    return res.json(response(401, "Invalid credentials"));
  }
}

async function addToFavouritesService(data, res) {
  const { username, sessionId, ad } = data;
  const result = await userDAO.authorize(username, sessionId);
  if (result) {
    if (await userDAO.addToFavourites(username, ad)) {
      const favourites = await userDAO.getFavourites(username);
      res.json(response(200, "Favourite added", "", favourites));
    } else {
      res.json(response(409, "Favourite already exists"));
    }
  } else {
    res.json(
      response(401, "Παρακαλώ συνδεθείτε για προσθήκη στη λίστα αγαπημένων")
    );
  }
}

async function removeFromFavouritesService(data, res) {
  const { username, sessionId, ad } = data;
  const result = userDAO.authorize(username, sessionId);
  if (result) {
    if (await userDAO.removeFromFavourites(username, ad)) {
      const favourites = await userDAO.getFavourites(username);
      res.json(response(200, "Favourite removed", "", favourites));
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
