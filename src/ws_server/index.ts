import { WebSocketServer } from 'ws';
import RequestHandler from './request_handler.ts';
import Database from './database.ts';
import UserSession from './user_session.ts';
import { type WsRequest } from '../types/types.ts';
import { EventEmitter } from 'node:events';

const wss: WebSocketServer = new WebSocketServer({ port: 3000 });

const database = new Database();
const requestHandler = new RequestHandler(database);
class ServerEmitter extends EventEmitter {}
export const serverEmitter = new ServerEmitter();

wss.on('connection', function connection(ws) {
  const userSession = new UserSession(ws);
  ws.on('error', console.error);

  ws.on('message', (data: string) => {
    const msg = JSON.parse(data);
    if (typeof msg.type === 'string' && typeof msg.data === 'string' && typeof msg.id === 'number') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      requestHandler.getAnswer(msg, userSession);
    }
  });

  ws.on('close', () => {
    userSession.destroy();
  });

  serverEmitter.on('message', (data: WsRequest) => {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(data));
    });
  });

  serverEmitter.on('update_winners', () => {
    const winners = database.getWinners();
    wss.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          type: 'update_winners',
          data: JSON.stringify(winners),
          id: 0,
        }),
      );
    });
  });
});

export default wss;
