import express, { Request, Response } from "express";
import { authRouter } from "./routes/authRoutes";

const app = express();

app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
