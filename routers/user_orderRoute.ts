import express, { Request, Response } from "express";
import { dbClient } from "../server";

export const userOrderRoutes = express.Router();

userOrderRoutes.get("/orders_preview", getSelfOrders);

async function getSelfOrders(req: Request, res: Response) {
  const userId= req.session.user?.id
    const queryResult1 = await dbClient.query(
      `SELECT order_id, status, service_name, selected_date, service_start_time from orders where service_user_id = $1;`, [userId]
    );

    res.json(queryResult1.rows);

}