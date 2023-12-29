class User {
  constructor(data) {
    this._username = data.username;
    this._password = data.password;
    this._sessionId = data.sessionId;
    this._favourites = new Map();
    // Populate favourites map.
    Array.from(data.favourites).forEach((fav) => {
      this._favourites.set(fav.id, fav);
    });
  }

  get username() {
    return this._username;
  }

  get password() {
    return this._password;
  }

  set sessionId(sessionId) {
    this._sessionId = sessionId;
  }

  get sessionId() {
    return this._sessionId;
  }

  get favourites() {
    return Array.from(this._favourites.values());
  }

  addToFavourites(ad) {
    if (!this._favourites.has(ad.id)) {
      this._favourites.set(ad.id, ad);
      return true;
    } else {
      return false;
    }
  }

  removeFromFavourites(ad) {
    if (this._favourites.has(ad.id)) {
      this._favourites.delete(ad.id);
      return true;
    } else {
      return false;
    }
  }
}
export default User;
