import express from 'express';
import Session from 'express-session';
import { generateNonce, SiweMessage } from 'siwe';

const app = express();
app.use(express.json());
app.set('trust proxy', 1);

// app.use(Session({
//     name: 'siwe-quickstart',
//     secret: "siwe-quickstart-secret",
//     resave: true,
//     saveUninitialized: true,
//     cookie: { secure: true, sameSite: true }
// }));

app.use(Session({
cookie:{
    secure: true,
    maxAge:60000
       },
secret: 'siwe-quickstart-secret',
saveUninitialized: true,
resave: false,
name:'siwe-quickstart'
}));

export default async function nonce(req,res){
    if(!req.session){
        res.statusCode = 400;
        res.json({message:"Unauthenticated"});
    }
    // req.session.nonce = generateNonce();
    // res.setHeader('Content-Type', 'text/plain');
    // res.status(200).send(req.session.nonce);
    res.statusCode = 200;
    res.json({message:'Its working'});
}