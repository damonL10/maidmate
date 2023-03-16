import express, { Request, Response } from "express";
import { dbClient } from "../server";
import { checkPassword, hashPassword } from "../hash";

export const userRoutes = express.Router();

// check user is login
userRoutes.get("/user", (req: Request, res: Response) => {
    res.json(req.session["user"] ? req.session["user"] : { id: null });
});

// handle user login
userRoutes.post("/login", async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    const users = await dbClient.query(
        `SELECT * FROM service_user WHERE email = $1;`,
        [email]
    );

    if (users.rows.length === 0) {
        res.status(400).json({ message: "User doesn't exist!" });
        return;
    }

    const user = users.rows[0];
    const check = await checkPassword(password, user.password);

    if (!check) {
        res.status(400).json({ message: "Wrong Password" });
        return;
    }
    req.session["user"] = { id: user.id };

    res.status(201).json({ message: "Login Success!" });
});

// handle user register
userRoutes.post("/register", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "missing username / password" });
            return;
        }

        const check = await dbClient.query(
            `SELECT * FROM service_user WHERE email = $1;`,
            [email]
        );

        if (check.rows.length !== 0) {
            res.status(400).json({ message: "user is exist!" });
            return;
        }

        const encrypted_pwd = await hashPassword(password);

        await dbClient.query(
            `INSERT INTO service_user (email,password) VALUES ($1, $2);`,
            [email, encrypted_pwd]
        );

        const users = await dbClient.query(
            `SELECT * FROM service_user WHERE email = $1;`,
            [email]
        );

        const user = users.rows[0];

        req.session["user"] = { id: user.id };

        res.status(201).json({ message: "Register Success!" });
    } catch (ex) {
        console.log(ex);
        res.status(400).json({ message: "Something Wrong" });
    }
});

// handle user logout
userRoutes.put("/logout", (req: Request, res: Response) => {
    delete req.session["user"];
    res.json({ message: "logout success" });
});

userRoutes.post("/orderDetail/:sid", async (req, res) => {
    const orderId = req.params.sid;

    if (!orderId) {
        res.status(400).json({ message: "missing order id" });
        return;
    }

    const getData = await dbClient.query(
        `SELECT * FROM orders WHERE order_id = $1 ;`,
        [orderId]
    );

    if (getData.rows.length !== 0) {
        res.status(201).json({ message: "find order", data: getData.rows[0] });
        return;
    } else {
        res.status(400).json({ message: "order doesn't exist!" });
    }
});
