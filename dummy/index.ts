import http from "http";
import { WebSocketServer, type RawData } from "ws";

const server = http.createServer((req, res) => {
  console.log(new Date() + " Received request for " + req.url);
  res.end("Hello World!");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.send("connected");
  console.log("connection established");

  ws.on("error", () => {
    throw new Error("error");
  });

  ws.on("message", (data: RawData, isBinary: boolean) => {
    wss.clients.forEach((client) => {
      if (client !== ws) client.send(data, { binary: isBinary });
    });
  });
});

server.listen(8080, () => {
  console.log(new Date() + " Server is listening on port 8080");
});
