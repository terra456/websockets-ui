import { WebSocketServer } from 'ws';

const wss: WebSocketServer = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', (data: string) => {
    const str = JSON.parse(data);
    if (str === 'foo') {
      ws.send(JSON.stringify('echo foo'));
    }
 
    console.log('received: %s', data);
  });

  ws.send(JSON.stringify('something'));
});

export default wss;