import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import User from "../entities/user.js";
import { MongoClient, ServerApiVersion } from "mongodb";

class UserDAO {
  constructor(database) {
    if (process.env.npm_config_db != "1") this.userDAO = new InMemoryUserDAO();
    else this.userDAO = new DatabaseUserDAO(database);
  }

  async getUser(username) {
    return this.userDAO.getUser(username);
  }

  async authorize(username, sId) {
    return this.userDAO.authorize(username, sId);
  }

  async getFavourites(username) {
    return this.userDAO.getFavourites(username);
  }

  async addToFavourites(username, ad) {
    return this.userDAO.addToFavourites(username, ad);
  }

  async removeFromFavourites(username, ad) {
    return this.userDAO.removeFromFavourites(username, ad);
  }

  async login(username, password) {
    return this.userDAO.login(username, password);
  }
}

class InMemoryUserDAO {
  constructor() {
    this._users = this.loadUserData();
  }

  async getUser(username) {
    return this._users.find((user) => user.username === username);
  }

  authorize(username, sId) {
    const user = this._users.find(
      (u) => u.username === username && u.sessionId === sId
    );
    return user;
  }

  getFavourites(username) {
    const user = this._users.find((user) => user.username === username);
    if (user) return user.favourites;
  }

  addToFavourites(username, ad) {
    const user = this._users.find((user) => user.username === username);
    const bool = user.addToFavourites(ad);
    return bool;
  }

  removeFromFavourites(username, ad) {
    const user = this._users.find((user) => user.username === username);
    const bool = user.removeFromFavourites(ad);
    return bool;
  }

  login(username, password) {
    const user = this._users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      user.sessionId = uuidv4();
      return user;
    }
  }

  loadUserData() {
    try {
      const data = fs.readFileSync("server/data/users.json", "utf-8");
      const result = JSON.parse(data);
      return result.map((user) => new User(user));
    } catch (error) {
      console.error("Error loading user data:", error.message);
      return [];
    }
  }
}

class DatabaseUserDAO {
  constructor(database) {
    const MONGO_USER = process.env.npm_config_user || "csaueb";
    const MONGO_PASS = process.env.npm_config_pass || "csaueb";
    const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.ndkdf9f.mongodb.net/?retryWrites=true&w=majority`;
    this._client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    this._collection;
    this.run().catch(console.dir);
  }

  async authorize(username, sId) {
    const res = await this._collection.findOne({ username, sessionId: sId });
    if (res) return new User(res);
  }

  async getUser(name) {
    const res = await this._collection.findOne({ username: name });
    if (res) return new User(res);
  }

  async getFavourites(name) {
    const res = await this._collection.findOne({ username: name });
    if (res) {
      const user = new User(res);
      return user.favourites;
    }
  }

  async addToFavourites(name, ad) {
    const res = await this._collection.findOne({ username: name });
    if (res) {
      const user = new User(res);
      if (user.addToFavourites(ad)) {
        await this._collection.updateOne(
          { username: name },
          { $set: { favourites: user.favourites } }
        );
        return true;
      }
      return false;
    }
    return false;
  }

  async removeFromFavourites(name, ad) {
    const res = await this._collection.findOne({ username: name });
    if (res) {
      const user = new User(res);
      const bool = user.removeFromFavourites(ad);
      await this._collection.updateOne(
        { username: name },
        { $set: { favourites: user.favourites } }
      );
      return bool;
    }
    return false;
  }

  async login(username, password) {
    const res = await this._collection.findOne({ username, password });
    if (res) {
      const user = new User(res);
      user.sessionId = uuidv4();
      await this._collection.updateOne(
        { username },
        { $set: { sessionId: user.sessionId } }
      );
      return user;
    }
  }

  async run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this._client.connect();
      // Send a ping to confirm a successful connection
      this._collection = this._client.db("istos").collection("users");
      console.log("You successfully connected to MongoDB!");
      const users1 = await this._collection.findOne({
        username: "admin",
        id: 1,
      });
      console.log(users1);
    } catch (err) {
      console.log(err);
    }
  }
}

export default UserDAO;
