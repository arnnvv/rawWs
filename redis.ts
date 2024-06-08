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
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  subscribe(userId: string, roomId: string, ws: WebSocket) {
    this.subscriptions.set(userId, [
      ...(this.subscriptions.get(userId) || []),
      roomId,
    ]);

    this.reverseSubscriptions.set(roomId, {
      ...(this.reverseSubscriptions.get(roomId) || {}),
      [userId]: { userId: userId, ws },
    });

    if (
      Object.keys(this.reverseSubscriptions.get(roomId) || {})?.length === 1
    ) {
      console.log(`subscribing message from ${roomId}`);
      this.subscriber.subscribe(roomId, (payload) => {
        try {
          // const parsedPayload = JSON.parse(payload);
          const subscribers = this.reverseSubscriptions.get(roomId) || {};
          Object.values(subscribers).forEach(({ ws }) => ws.send(payload));
        } catch (e) {
          console.error("erroneous payload found?", e);
        }
      });
    }
  }

  unsubscribe(userId: string, roomId: string, ws: WebSocket) {
    this.subscriptions.set(userId, [
      ...(this.subscriptions.get(userId) || []).filter(),
    ]);
  }

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
