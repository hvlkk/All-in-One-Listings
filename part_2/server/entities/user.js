class User {
  constructor(data) {
    this._username = data.username;
    this._password = data.password;
    this._sessionId = data.sessionId;

    /* for ease of access, favourites will be represented with a Map, with each ad id
     * being mapped to an unnamed object that represents that specific ad.     */
    this._favourites = new Map();
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

  // returns an array containing the user's favourites
  get favourites() {
    return Array.from(this._favourites.values());
  }

  /* adds an ad to the favourites of a user. Returns true if the ad was added to the
   * user's favourites successfully, and false if it was already in the user's favourites. */
  addToFavourites(ad) {
    if (!this._favourites.has(ad.id)) {
      this._favourites.set(ad.id, ad);
      return true;
    } else {
      return false;
    }
  }

  /* similarly, removes an ad from the favourites of a user. Returns true if the ad
   * was in the user's favourites and was removed successfully, false otherwise. */
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
