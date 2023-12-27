class InMemoryUserDAO {
  constructor() {
    this.users = this.loadUserData();
  }

  async getUser(username) {
    return this.users.find((user) => user.username === username);
  }

  loadUserData() {
    try {
      const data = fs.readFileSync("users.json", "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading user data:", error.message);
      return [];
    }
  }
}
