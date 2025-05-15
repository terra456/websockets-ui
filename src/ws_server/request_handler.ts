import { type WsRequest } from '../types/types.ts';
import Database from './database.ts';

class RequestHandler {
  commands: Map<string, <T, K>(data: T) => K>;
  constructor() {
    const database = new Database();
    this.commands = new Map([
      ['reg', database.login],
      // ['update_winners', (data) => {return data}],
      // ['create_room', () => {}],
      // ['add_user_to_room', () => {}],
      // ['create_game', () => {}],
      // ['update_room', () => {}],
      // ['add_ships', () => {}],
      // ['start_game', () => {}],
      // ['attack', () => {}],
      // ['randomAttack', () => {}],
      // ['turn', () => {}],
      // ['finish', () => {}],
    ]);
  }

  get = <T, K>(request: WsRequest<T>): WsRequest<K> | undefined => {
    const operation = this.commands.get(request.type);
    console.log(operation?.toString());
    if (operation) {
      const result = operation(request.data);
      return {
        type: request.type,
        data: JSON.stringify(result),
        id: 0,
      };
    }
  };
}

export default RequestHandler;
