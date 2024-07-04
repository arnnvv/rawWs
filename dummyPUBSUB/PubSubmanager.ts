import { createClient, type RedisClientType } from "redis";

class PubSubManager {
  private static instance: PubSubManager;
  private redisClient: RedisClientType;
  private subscriptions: Map<string, string[]>; //{(stock, id of users subscribed to stock)}

  private constructor() {
    this.redisClient = createClient();
    this.redisClient.connect();
    this.subscriptions = new Map<string, string[]>();
  }

  public static getInstance(): PubSubManager {
    if (!PubSubManager.instance) {
      this.instance = new PubSubManager();
    }
    return this.instance;
  }

  public subscribe(userId: string, stock: string) {
    if (!this.subscriptions.has(stock)) this.subscriptions.set(stock, []);
    this.subscriptions.get(stock)?.push(userId);

    if (this.subscriptions.get(stock)?.length === 1) {
      this.redisClient.subscribe(stock, (message: string) => {
        this.handleMessage(stock, message);
      });
      console.log(`Subscribed to ${stock}`);
    }
  }

  public unsubscribe(userId: string, stock: string) {
    this.subscriptions
      .get(stock)
      ?.filter((id: string): boolean => id !== userId);
    if (this.subscriptions.get(stock)?.length === 0) {
      this.subscriptions.delete(stock);
      this.redisClient.unsubscribe(stock);
    }
  }

  private handleMessage(stock: string, message: string) {
    console.log(`Message received on channel ${stock}: ${message}`);
    this.subscriptions.get(stock)?.forEach((userId: string) => {
      //Dummy eventually will be doing a ws.client.send()
      console.log(`Sending message to userID: ${userId}`);
    });
  }

  public async disconnect(): Promise<void> {
    await this.redisClient.disconnect();
  }
}

export default PubSubManager;
