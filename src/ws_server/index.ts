import { WebSocketServer } from 'ws';
import RequestHandler from './request_handler.ts';

const wss: WebSocketServer = new WebSocketServer({ port: 3000 });

const requestHandler = new RequestHandler();

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', (data: string) => {
    const msg = JSON.parse(data);
    if (msg.type && msg.data) {
      const req = requestHandler.get(msg);
      ws.send(JSON.stringify(req));
    }
 
    console.log('received: %s', msg);
  });

  ws.send(JSON.stringify('something'));
});

export default wss;