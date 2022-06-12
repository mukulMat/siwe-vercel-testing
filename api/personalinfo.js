import express from 'express';
import Session from 'express-session';
import { generateNonce, SiweMessage } from 'siwe';

const app = express();
app.use(express.json());
app.set('trust proxy', 1);

app.use(Session({
    name: 'siwe-quickstart',
    secret: "siwe-quickstart-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: true }
}));

export default async function personalinfo(req,res){
    req.session.nonce = generateNonce();
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(req.session.nonce);
}

export default async function personalinfo(req,res){
    if (!req.session.siwe) {
        res.status(401).json({ message: 'Please sigin first' });
        return;
    }
    console.log("Authentication Done");
    res.setHeader('Content-Type', 'text/plain');
    res.send(`You are authenticated and your address is: ${req.session.siwe.address}`)
};