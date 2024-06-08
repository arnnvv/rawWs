import { RedisClientType, createClient } from "redis";
import WebSocket from "ws";

class RedisManager {
  private static instance: RedisManager;
  private subscriber: RedisClientType;
  public publisher: RedisClientType;
  private subscriptions: Map<string, string[]>;
  private reverseSubscriptions: Map<
    string,
    { [userId: string]: { userId: string; ws: WebSocket } }
  >;

  private constructor() {
    this.subscriber = createClient();
    this.publisher = createClient();
    this.publisher.connect();
    this.subscriber.connect();
    this.subscriptions = new Map<string, string[]>();
    this.reverseSubscriptions = new Map<
      string,
      {
        [userId: string]: {
          userId: string;
          ws: WebSocket;
        };
      }
    >();
  }

  static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  subscribe(userId: string, roomId: string, ws: WebSocket) {}

  unsubscribe(userId: string, roomId: string, ws: WebSocket) {}

  publish(room: string, message: any) {
    console.log(`publishing message to ${room}`);
    this.publisher.publish(room, JSON.stringify(message));
  }

  addChatMessage(roomId: string, message: any) {
    this.publish(roomId, {
      type: "message",
      payload: {
        message,
      },
    });
  }
}

export default RedisManager;
