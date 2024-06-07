import http from "http";
import WebSocket, { RawData, WebSocketServer } from "ws";

const port: number = 8080;

const server = http.createServer();

const wss = new WebSocketServer({ server });

const users: {
  [key: string]: {
    room: string;
    ws: WebSocket;
  };
} = {};

let count: number = 0;

wss.on("connection", (ws: WebSocket) => {
  const id = count++;
  ws.on("message", (message: RawData) => {
    const data = JSON.parse(message.toString());
    if (data.type === "join") {
      users[id] = {
        room: data.payload.room,
        ws,
      };
    }
    if (data.type === "message") {
      const roomId = users[id].room;
      for (const userId in users) {
        if (users[userId].room === roomId) {
          users[userId].ws.send(
            JSON.stringify({
              type: "message",
              message: data.payload.message,
            }),
          );
        }
      }
    }
    console.log("received: %s", message);
    ws.send(`Hello, you sent -> ${message}`);
  });
});

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
