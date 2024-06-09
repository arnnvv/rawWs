import http from "http";
import WebSocket, { RawData, WebSocketServer } from "ws";
import RedisManager from "./redis";

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

wss.on("connection", (ws: WebSocket): void => {
  const id = count++;
  ws.on("message", (message: RawData): void => {
    const data = JSON.parse(message.toString());
    if (data.type === "join") {
      users[id] = {
        roomId: data.payload.roomId,
        ws,
      };

      RedisManager.getInstance().subscribe(
        id.toString(),
        data.payload.roomId,
        ws,
      );
    }
    if (data.type === "message") {
      const roomId = users[id].roomId;
      RedisManager.getInstance().addChatMessage(roomId, message);

      /*
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
      */
    }
  });

  ws.on("close", () => {
    RedisManager.getInstance().unsubscribe(id.toString(), users[id].roomId);
  });
});

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
