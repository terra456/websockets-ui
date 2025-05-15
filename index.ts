import { httpServer } from "./src/http_server/index.ts";
import wss from "@/ws_server/index.ts";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

wss.on;