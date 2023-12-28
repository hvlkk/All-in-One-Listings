class FavouriteService {
  constructor(userDAO, res) {
    this.userDAO = userDAO;
    this.res = res;
  }

  async retrieve(username, sessionId) {
    const user = await this.userDAO.authorize(username, sessionId);
    if (user) {
      const favourites = user.favourites;
      return this.res.json(response(200, "Success", "", favourites));
    } else {
      return this.res.json(response(401, "Invalid credentials"));
    }
  }

  //   async add(data){
  //     const { username, sessionId, ad } = data;
  //     const user = await this.userDAO.authorize(username, sessionId);

  //   }
}

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
