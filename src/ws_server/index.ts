import { createWebSocketStream, WebSocketServer } from 'ws';
import RequestHandler from './request_handler.ts';
import Database from './database.ts';
import UserSession from './user_session.ts';

const wss: WebSocketServer = new WebSocketServer({ port: 3000 });

const database = new Database();
const requestHandler = new RequestHandler(database);

wss.on('connection', function connection(ws) {
  const duplex = createWebSocketStream(ws, { encoding: 'utf8' });
  const userSession = new UserSession(ws);
  ws.on('error', console.error);

  ws.on('message', (data: string) => {
    const msg = JSON.parse(data);
    if (typeof msg.type === 'string' && typeof msg.data === 'string' && typeof msg.id === 'number') {
      requestHandler.getAnswer(msg, userSession);
    }

    console.log('received: %s', data);
  });

  ws.send(JSON.stringify('something'));
});

export default wss;
