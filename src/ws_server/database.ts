import SingleRoom from '../game/single_room.ts';
import Room from '../game/room.ts';
import User from '../game/user.ts';
import { type Winner, type LoginRequest, type UpdateRoom, type IUser } from '../types/types.ts';
import { serverEmitter } from './index.ts';
import type UserSession from './user_session.ts';

class Database {
  users: User[] = [];
  rooms: Room[] = [];

  registrate = (data: LoginRequest): User => {
    const user = new User(data);
    this.users.push(user);
    return user;
  };

  getWinners = (): Winner[] => {
    const winners = this.users.map(({ name, wins }) => {
      return { name, wins };
    });
    return winners;
  };

  login = (data: string, userSession: UserSession): void => {
    const userData = JSON.parse(data) as LoginRequest;
    let user = this.users.find((user) => user.name === userData.name);
    if (user) {
      if (user.password !== userData.password) {
        userSession.sendMessage({
          type: 'reg',
          data: JSON.stringify({
            error: true,
            errorText: 'password incorrect',
          }),
          id: 0,
        });
        return;
      }
    }
    user = this.registrate(userData);
    userSession.setUser(user);

    userSession.sendMessage({
      type: 'update_room',
      data: JSON.stringify(this.getFreeRoms()),
      id: 0,
    });

    userSession.sendMessage({
      type: 'update_winners',
      data: JSON.stringify(this.getWinners()),
      id: 0,
    });
  };

  getFreeRoms = (): UpdateRoom[] => {
    const freeRooms = this.rooms
      .filter((el) => el.isAvailable)
      .map((el) => {
        const roomUsers = [el.games[0].getUser()];
        return {
          roomId: el.roomId,
          roomUsers,
        };
      });
    return freeRooms;
  };

  createRoom = (_data: string, userSession: UserSession): void => {
    if (userSession.user && userSession.room === undefined) {
      const { name, index } = userSession.user.getUser();
      const room = new Room({ name, index });
      this.rooms.push(room);
      room.destroy = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        // room === undefined;
        const ind = this.rooms.findIndex((el) => el.roomId === room.roomId);
        if (ind >= 0) {
          this.rooms.splice(ind, 1);
        }
      };
      userSession.setRoom(room);
      serverEmitter.emit('message', {
        type: 'update_room',
        data: JSON.stringify(this.getFreeRoms()),
        id: 0,
      });
    }
  };

  addUserToRoom = (data: string, userSession: UserSession): void => {
    const { indexRoom } = JSON.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const room = this.rooms.find((el) => el.roomId === indexRoom)!;

    if (room && room.roomId !== userSession.room?.roomId) {
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      const { name, index } = userSession.user?.getUser() as IUser;
      room.addUserToRoom({ name, index });
      userSession.setRoom(room);
      serverEmitter.emit('message', {
        type: 'update_room',
        data: JSON.stringify(this.getFreeRoms()),
        id: 0,
      });
      room.gameEmitter.emit('create_game');
    }
  };

  singlePlay = (_data: string, userSession: UserSession): void => {
    if (userSession.user && userSession.room === undefined) {
      const { name, index } = userSession.user.getUser();
      const room = new SingleRoom({ name, index });
      this.rooms.push(room);
      room.destroy = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        // room === undefined;
        const ind = this.rooms.findIndex((el) => el.roomId === room.roomId);
        if (ind >= 0) {
          this.rooms.splice(ind, 1);
        }
      };
      userSession.setRoom(room);
      room.gameEmitter.emit('create_game');
      // userSession.sendMessage({
      //   type: 'update_room',
      //   data: JSON.stringify([...this.getFreeRoms(), room.updateRoomInfo()]),
      //   id: 0,
      // });
    }
  };
}

export default Database;
