import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import type { User as userType } from "@prisma/client";

type DoneFn = (error: any, user?: any, options?: { message: string }) => void;

const prisma = new PrismaClient();

//This function takes the username and the password, searches for the user in the database, returns done with no error and user if the user was found.
//Otherwise, it returns either that the user does not exist or the password entered was invalid.
const verifyCallback = async (
  username: string,
  password: string,
  done: DoneFn
) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  //User does not exist in the database
  if (!user) {
    return done(null, false, { message: "User does not exist." });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (isValid) {
    return done(null, user);
  } else {
    return done(null, false, { message: "Password is not valid." }); // Password was invalid
  }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

//adds the user onto the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

//removes the user from the session
passport.deserializeUser(async (userId: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
