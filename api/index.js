import express from "express";
import { generateNonce, SiweMessage } from "siwe";
import mongoose from "mongoose";
import siweModel from "./siwe.model.js"
const app = express();
app.use(express.json());

mongoose.connect(
  "mongodb+srv://MukulMatrix:Spx5ambK7rIeELdB@cluster0.ejncniu.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) throw err;
    console.log("DATABASE CONNECTED");
  }
);

app.get("/api/check", async (req, res) => {
  try {
    const nonce = generateNonce();
    return res.json({ message: "Success!!", nonce });
  } catch (err) {
    return res.json({ error: err });
  }
});

app.post("/api/siginwithethereum", async (req, res) => {
  try {
    if (!req.body.message) {
      return res
        .status(422)
        .json({ message: "Expected prepareMessage object as body." });
    }
    let message = new SiweMessage(req.body.message);
    const fields = await message.validate(req.body.signature);
    if (fields.nonce !== req.body.nonce) {
      return res.status(422).json({
        message: `invalid nonce.`,
      });
    }
    const saveObject = {
      nonce: req.body.nonce,
      fields: fields,
    };
    await siweModel.create(saveObject);
    
    return res.json({ message: "success", data: fields });
  } catch (e) {
    return res.json({ message: "Something went wrong", error: err });
  }
});

app.get("/api/personal_info", async (req, res) => {
  try {
    const siwe = await siweModel.findOne({ nonce: req.body.nonce });
    if (!siwe) {
      return res.status(401).json({ message: "Please sigin first" });
    }
    //   console.log("Authentication Done");
    //   res.setHeader("Content-Type", "text/plain");
    return res.send(`You are authenticated and your address is: ${siwe}`);
  } catch (err) {
    return res.json({ message: "Something went wrong", error: err });
  }
});

module.exports = app;
