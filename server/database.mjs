import { MongoClient, ServerApiVersion } from "mongodb";

class MongoDB {
  constructor() {
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
    this.run().catch(console.dir);
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

  get collection() {
    return this._collection;
  }

  //   async getUser(name) {
  //     return await this._collection.findOne({ username: name });
  //   }

  //   async getFavourites(name) {
  //     const user = await this._collection.findOne({ username: name });
  //     return user.favourites;
  //   }

  //   async addToFavourites(name, ad) {
  //     const user = await this._collection.findOne({ username: name });
  //     user.favourites.push(ad);
  //     await this._collection.updateOne(
  //       { username: name },
  //       { $set: { favourites: user.favourites } }
  //     );
  //   }

  //   async removeFromFavourites(name, ad) {
  //     const user = await this._collection.findOne({ username: name });
  //     user.favourites = user.favourites.filter((fav) => fav.id !== ad.id);
  //     await this._collection.updateOne(
  //       { username: name },
  //       { $set: { favourites: user.favourites } }
  //     );
  //   }
}
