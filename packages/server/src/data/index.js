class Data {
  // rooms = [];
  chat = [];
  users = [];
  state = [];

  addUser(username) {
    if (this.users.includes(username)) return false;
    else {
      this.users.push(username);
      return true;
    }
  }

  removeUser(username) {
    const index = this.users.indexOf(username);
    if (index > -1) this.users.splice(index, 1);
  }

  sendMessage(message, user) {
    this.chat.push({
      message,
      user,
    });
  }
}

module.exports = new Data();
