import express, { Request, Response } from "express";
import { dbClient } from "../server";

export const providerOrderRoutes = express.Router();
export const providerUpdateOrderStatusRoutes = express.Router();

providerOrderRoutes.get("/provider_myorders", providerGetMyOrders);
providerUpdateOrderStatusRoutes.put("/provider_myorders/:orderId", providerUpdateOrderStatus);

async function providerGetMyOrders(req: Request, res: Response) {
  const providerId = req.session.user?.id as number;
  // console.log("from server:",providerId);
    const providerGetMyOrdersQueryResult = await dbClient.query(
      "SELECT service_name, selected_date, service_start_time, service_region, status, order_id FROM orders WHERE service_provider_id = $1", [providerId]
    );
    const providerMyOrders = providerGetMyOrdersQueryResult.rows;
    res.json(providerMyOrders);

}

async function providerUpdateOrderStatus(req: Request, res: Response) {
  const acceptOrderId = req.params.orderId;
  // console.log(req.params.orderId)
  // console.log("order id:", acceptOrderId);
  const acceptedStatus = req.body.status;
  // console.log("order new status:", acceptedStatus);
  const queryResult = await dbClient.query(
    /*SQL */ `UPDATE orders SET status = $1 WHERE order_id = $2`,
    [acceptedStatus, acceptOrderId]
  );
  console.log(queryResult.rows);

  res.json({ message: "update accepted status success" });
}
