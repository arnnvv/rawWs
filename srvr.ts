import http from "http";
import WebSocket, { RawData, WebSocketServer } from "ws";

const port: number = 8080;

const server = http.createServer();

const wss = new WebSocketServer({ server });

const users: {
  [key: string]: {
    roomId: string;
    ws: WebSocket;
  };
} = {};

let count: number = 0;

wss.on("connection", (ws: WebSocket) => {
  const id = count++;
  ws.on("message", (message: RawData) => {
    const data = JSON.parse(message.toString());
    if (data.type === "join") {
      console.log(data.payload.roomId);
      users[id] = {
        roomId: data.payload.roomId,
        ws,
      };
    }
    if (data.type === "message") {
      console.log(data.payload.message);

      const roomId = users[id].roomId;
      for (const userId in users) {
        if (users[userId].roomId === roomId) {
          users[userId].ws.send(
            JSON.stringify({
              type: "message",
              message: data.payload.message,
            }),
          );
        }
      }
    }
  });
});

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
