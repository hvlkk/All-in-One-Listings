import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import User from "../entities/user.js";
import { MongoClient, ServerApiVersion } from "mongodb";

class UserDAO {
  /* If the app has been started with "npm start --db=1", the UserDAO will be a
   * database DAO. Otherwise, it'll access the dummy file in memory that contains 2
   * placeholder users with an empty list of favourites.  */
  constructor() {
    if (process.env.npm_config_db == "1") this.userDAO = new DatabaseUserDAO();
    else this.userDAO = new InMemoryUserDAO();
  }

  // Ensures the username + sessionId passed as arguments is a valid combination in our database.
  async authorize(username, sessionId) {
    return this.userDAO.authorize(username, sessionId);
  }

  // Fetches the list of favourites for a user (with the username passed as an argument).
  async getFavourites(username) {
    return this.userDAO.getFavourites(username);
  }

  // Adds an ad to the favourites of the user whose username is passed as an argument.
  async addToFavourites(username, ad) {
    return this.userDAO.addToFavourites(username, ad);
  }

  // Symmentrically, removes an ad from the favourites of the user whose username is passed as an argument.
  async removeFromFavourites(username, ad) {
    return this.userDAO.removeFromFavourites(username, ad);
  }

  // Logs in a user, returns the User instance that was created.
  async login(username, password) {
    return this.userDAO.login(username, password);
  }
}

class InMemoryUserDAO {
  constructor() {
    this._users = this.loadUserData();
  }

  authorize(username, sessionId) {
    const user = this._users.find(
      (u) => u.username === username && u.sessionId === sessionId
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

  // parses the users.json file, and fetches an array of User objects with the users contained in the file.
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
  constructor() {
    const MONGO_USER = "csaueb";
    const MONGO_PASS = "csaueb";
    const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.ndkdf9f.mongodb.net/?retryWrites=true&w=majority`;
    this._client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    this._collection; // will be used to fetch the collection once the connection to the db is established
    this.run().catch(console.dir);
  }

  async authorize(username, sessionId) {
    const res = await this._collection.findOne({
      username: username,
      sessionId: sessionId,
    });
    if (res) return new User(res);
  }

  async getFavourites(username) {
    const res = await this._collection.findOne({ username: username });
    if (res) {
      const user = new User(res);
      return user.favourites;
    }
  }

  async addToFavourites(username, ad) {
    const res = await this._collection.findOne({ username: username });
    if (res) {
      const user = new User(res);
      if (user.addToFavourites(ad)) {
        await this._collection.updateOne(
          { username: username },
          { $set: { favourites: user.favourites } }
        );
        return true;
      }
      return false;
    }
    return false;
  }

  async removeFromFavourites(username, ad) {
    const res = await this._collection.findOne({ username: username });
    if (res) {
      const user = new User(res);
      const bool = user.removeFromFavourites(ad);
      await this._collection.updateOne(
        { username: username },
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
        { username: username },
        { $set: { sessionId: user.sessionId } }
      );
      return user;
    }
  }

  // Connects to the database, and fetches the collection used.
  async run() {
    try {
      await this._client.connect();
      this._collection = this._client.db("istos").collection("users");
      console.log("Successfully connected to MongoDB.");
    } catch (err) {
      console.log("There was an error connecting to MongoDB:");
      console.log(err);
    }
  }
}

export default UserDAO;
