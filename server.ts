import express from "express";
import expressSession from "express-session";

import dotenv from "dotenv";
dotenv.config();

import pg from "pg";

import path from "path";
import { logger } from "./logger";

// database connect
export const dbClient = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

dbClient.connect();

// express setup
const app = express();
app.use(express.urlencoded());
app.use(express.json());

// express session setup
app.use(
    expressSession({
        secret: Math.random().toString(32).slice(2),
        resave: true,
        saveUninitialized: true,
    })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "private")));
app.use("/uploads", express.static("uploads"));

// router
import { adminRoutes } from "./routers/adminRoute";
import { userRoutes } from "./routers/userRouter";
import { userOrderRoutes } from "./routers/user_orderRoute";
import { serviceRoutes } from "./routers/serviceRouter";
import { providerLoginRoutes } from "./routers/providerLoginRoutes";
import { providerRegisterRoutes } from "./routers/providerRegisterRoutes";
import { providerOrderRoutes } from "./routers/providerOrderRoutes";
import { providerUpdateOrderStatusRoutes } from "./routers/providerOrderRoutes";

// admin
app.use("/admin_login", adminRoutes);

// provider
app.use("/providerLogin", providerLoginRoutes);
app.use("/registerProvider", providerRegisterRoutes);
app.use("/provider", providerOrderRoutes);
app.use ("/provider", providerUpdateOrderStatusRoutes);

// user
app.use(userRoutes);
app.use(userOrderRoutes);
app.use("/services", serviceRoutes);

// path
app.get("/service", (req, res) => {
    res.sendFile(path.join(__dirname, "public/service.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public/user_login.html"));
});

app.get("/center", (req, res) => {
    res.sendFile(path.join(__dirname, "private/user_my_order.html"));
});

app.get("/book", (req, res) => {
    res.sendFile(path.join(__dirname, "private/user_choose_plan.html"));
});

app.get("/order", (req, res) => {
    res.sendFile(path.join(__dirname, "private/user_confirm_order.html"));
});

app.get("/orderDetail/:sid", async (req, res) => {
    res.sendFile(path.join(__dirname, "private/user_confirm_detail.html"));
});

// handle 404 error
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "public/404.html"));
});

console.log("Welcome to Maid Mate");

const PORT = 3000;

app.listen(PORT, () => {
    logger.info(`MaidMate is hosting at http://localhost:${PORT} !!!`);
});
    