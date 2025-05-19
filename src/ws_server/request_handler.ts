import { type WsRequest } from '../types/types.ts';
import type Database from './database.ts';
import type UserSession from './user_session.ts';

class RequestHandler {
  commands: Map<string, (data: string, userSession: UserSession) => void>;
  database: Database;
  constructor(database: Database) {
    this.database = database;
    this.commands = new Map([
      ['reg', database.login],
      ['create_room', database.createRoom],
      ['add_user_to_room', database.addUserToRoom],
      [
        'add_ships',
        (data, userSession) => {
          userSession.room?.addShips(data);
        },
      ],
      [
        'attack',
        (data, userSession) => {
          userSession.room?.attack(data);
        },
      ],
      [
        'randomAttack',
        (data, userSession) => {
          userSession.room?.randomAttack(data);
        },
      ],
      [
        'single_play',
        (data, userSession) => {
          database.singlePlay(data, userSession);
        },
      ],
    ]);
  }

  getAnswer = (request: WsRequest, userSession: UserSession): void => {
    const operation = this.commands.get(request.type);
    if (operation) {
      operation(request.data, userSession);
    }
  };
}

export default RequestHandler;
