class LoginService {
  constructor(userDAO, res) {
    this.userDAO = userDAO;
    this.res = res;
  }

  async login(username, password) {
    const user = await this.userDAO.login(username, password);
    if (user) {
      return this.res.json(
        response(
          200,
          "Login Success",
          user.sessionId,
          Array.from(user.favourites.values())
        )
      );
    } else {
      return this.res.json(response(401, "Invalid credentials"));
    }
  }
}

export default LoginService;
