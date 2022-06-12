import express from "express";
import Session from "express-session";
import { generateNonce, SiweMessage } from "siwe";
const app = express();
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  Session({
    cookie: {
      secure: true,
      maxAge: 60000,
    },
    secret: "siwe-quickstart-secret",
    saveUninitialized: true,
    resave: false,
    name: "siwe-quickstart",
  })
);

export default function Checking(req, res) {
  try {
    if (!req.session) {
      res.statusCode = 400;
      return res.json({ message: "Unauthenticated" });
    }
    req.session.nonce = generateNonce();
    res.setHeader("Content-Type", "text/plain");
    return res.status(200).json(req.session.nonce);
  } catch (err) {
    return res.json({ error: err });
  }
}
