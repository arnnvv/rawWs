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
      { [userId: string]: { userId: string; ws: WebSocket } }
    >();
  }
}

export default RedisManager;
