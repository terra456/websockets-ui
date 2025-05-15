import { httpServer } from './src/http_server/index.ts';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import wss from './src/ws_server/index.ts';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
wss.on('close', () => {
  console.log('goobye');
});
