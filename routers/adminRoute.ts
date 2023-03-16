import { isAdminLoggedInApi } from "./../guard";
import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { checkPassword } from "../hash";

export const adminRoutes = express.Router();

adminRoutes.post("/admin_login", login);
adminRoutes.get("/adminInfo", isAdminLoggedInApi, getSelfAdminInfo);

async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "missing username/password" });
    return;
  }

  const queryResult = await dbClient.query(
    "SELECT id, username, password FROM admin WHERE username = $1",
    [username]
  );
  const admin = queryResult.rows[0];
  console.log('adminRoutes-login:', admin);
  console.log("debug: going into check email and password");
  if (!admin || !(await checkPassword(password, admin.password))) {
    res.status(400).json({ message: "invalid username/password" });
    return;
  }

  req.session.admin = { id: admin.id };

  console.log("debug: storing session id");
  res.json({ message: "success" });
}
async function getSelfAdminInfo(req: Request, res: Response) {
  const adminId = req.session.admin?.id as number;
  const queryResult = await dbClient.query("SELECT id, username FROM users WHERE id = $1", [
    adminId,
  ]);
  const admin = queryResult.rows[0];
  res.json(admin);
  
}
