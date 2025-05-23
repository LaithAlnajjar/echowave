import express, { Request, Response } from "express";
import { authRouter } from "./routes/authRoutes";
import passport from "passport";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import "./config/passport";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SESSION_SECRET = process.env.SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION SECRET is not defined in environment variables.");
}

app.use(
  session({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.send("YOU ARE AUTHENTICATED");
  } else {
    res.send("YOU ARE NOT AUTHENTICATED.");
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
