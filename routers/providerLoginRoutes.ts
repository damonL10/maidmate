import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { checkPassword } from "../hash";
import { isLoggedInApi } from "../guard";
export const providerLoginRoutes = express.Router();

providerLoginRoutes.post("/", login);
providerLoginRoutes.get("/", isLoggedInApi, providerInfo);
providerLoginRoutes.get("/providerLogout", providerLogout);

async function login(req: Request, res: Response) {
    const {email, password} = req.body;
    // console.log("debug: going into login");
    if (!email || !password) {
        res.status(400).json({message: "missing email/password"});
        return;
    }

    const queryResult = await dbClient.query("SELECT id, email, password FROM service_provider WHERE email = $1",
        [email]  
    );
    const pUser = queryResult.rows[0];
    // console.log(pUser);
    // console.log("debug: going into check email and password");
    if (!pUser || !(await checkPassword(password, pUser.password))) {
        res.status(400).json({message: "invalid email/password"});
        return;
    }

    req.session.user = {id: pUser.id}; 
    // console.log("debug: storing session id");
    res.json ({message: "login success!!"});
    // console.log("from server: login success!!!");
};

async function providerInfo(req: Request, res: Response) {
    const providerId = req.session.user?.id as number;
    // console.log (providerId);
    
    const queryResult = await dbClient.query("SELECT id, full_name, avatar FROM service_provider WHERE id=$1",
     [providerId])

    const provider = queryResult.rows[0];
    res.json(provider);
};


async function providerLogout(req: Request, res: Response) {
  delete req.session.user;
//   console.log("from server: provider logout success!!!")
  res.json ({message: "provider logout success!!"});
};
