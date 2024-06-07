import http from "http";
import { RawData, WebSocketServer } from "ws";

const port: number = 8080;

const server = http.createServer();

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", (message: RawData) => {
    console.log("received: %s", message);
    ws.send(`Hello, you sent -> ${message}`);
  });
});

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
