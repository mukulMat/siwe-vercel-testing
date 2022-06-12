import cors from 'cors';
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

export default async function siginwithethereum(req,res){
    try {
        if (!req.body.message) {
            res.status(422).json({ message: 'Expected prepareMessage object as body.' });
            return;
        }
        let message = new SiweMessage(req.body.message);
        const fields = await message.validate(req.body.signature);
        if (fields.nonce !== req.session.nonce) {
            console.log(req.session);
            res.status(422).json({
                message: `invalid nonce.`,
            });
            return;
        }
        req.session.siwe = fields;
        req.session.cookie.expires = new Date(fields.expirationTime);
        req.session.save(() => res.status(200).end());
    } catch (e) {
        req.session.siwe = null;
        req.session.nonce = null;
        console.error(e);
    }
}