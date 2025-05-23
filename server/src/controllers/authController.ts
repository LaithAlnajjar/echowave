import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import passport from "passport";

const prisma = new PrismaClient();

const register = async (req: Request, res: Response, next: NextFunction) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: hash,
      email: req.body.email,
    },
  });

  console.log(user);
  res.redirect("/auth/login");
};

const login = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
});

const logout = async (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export { register, login, logout };
