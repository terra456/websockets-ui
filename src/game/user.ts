import { type LoginResponse, type UpdateWinner, type IUser, type LoginRequest } from '../types/types.ts';
import { randomUUID } from 'node:crypto';

class User {
  name: string;
  password: string;
  index: string;
  wins: number;

  constructor({ name, password }: LoginRequest) {
    this.name = name;
    this.password = password;
    this.index = randomUUID();
    this.wins = 0;
  }

  getUser = (): IUser => {
    return {
      name: this.name,
      index: this.index,
    };
  };

  updateWinner = (): UpdateWinner => {
    this.wins += 1;
    return {
      name: this.name,
      wins: this.wins,
    };
  };

  loginUser = ({ name, password }: LoginRequest): LoginResponse => {
    if (password !== this.password) {
      return {
        name,
        index: '',
        error: true,
        errorText: `Password incorrect`,
      };
    }
    return {
      name,
      index: this.index,
      error: false,
      errorText: '',
    };
  };
}

export default User;
