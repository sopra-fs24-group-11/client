class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.password = null;
    this.token = null;
    this.status = null;
    this.email = null;
    this.creationdate = null;
    this.avatar = null;
    Object.assign(this, data);
  }
}

export default User;
