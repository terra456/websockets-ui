import User from '../game/user.ts';
import { type LoginRequest, type LoginResponse } from '../types/types.ts';

interface Room {
  id: string;
}

class Database {
  users: User[] = [];
  rooms: Room[] = [];

  registrate = (data: LoginRequest): LoginResponse => {
    const user = new User(data);
    console.log(user);
    this.users.push(user);
    return user.loginUser(data);
  };

  login = (data: LoginRequest): LoginResponse => {
    console.log(data);
    const i = this.users.findIndex((user) => {
      return user.name === data.name;
    });
    if (i < 0) {
      const user = this.registrate(data);
      return user;
    }
    const user = this.users[i].loginUser(data);
    return user;
  };
}

export default Database;
