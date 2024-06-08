import express from "express";
import type { Express, Request, Response } from "express";
import { createClient } from "redis";

const port: number = 3000;
const app: Express = express();
const redisClient = createClient();

redisClient.connect();
app.use(express.json());

const exp = async (): Promise<{
  username: string;
  email: string;
}> => {
  //Fetching data from Db when uncached
  await new Promise(
    (res: (value: unknown) => void): Timer => setTimeout(res, 2000),
  );
  return {
    username: "arnnnvvvv",
    email: "arnav@arnav.com",
  };
};

app.get("/uncached", async (req: Request, res: Response) => {
  const data = await exp();
  res.json(data);
});

app.get(
  "/cached",
  async (
    req: Request,
    res: Response,
  ): Promise<Response<any, Record<string, any>> | undefined> => {
    const cachedData = await redisClient.get("data");
    if (cachedData) return res.json(JSON.parse(cachedData));

    const data = await exp();
    await redisClient.set("data", JSON.stringify(data));
    res.json(data);
  },
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
