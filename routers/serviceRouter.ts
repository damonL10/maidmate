import express, { Request, Response } from "express";
import { dbClient } from "../server";

export const serviceRoutes = express.Router();

// check user is login
serviceRoutes.post("/", async (req: Request, res: Response) => {
    const { serviceId } = req.body;

    const services = await dbClient.query(
        `SELECT id, category_name FROM service_category WHERE id = $1;`,
        [serviceId]
    );

    if (services.rows.length === 0) {
        res.status(400).json({ message: "Service Category doesn't exist!" });
        return;
    }

    res.status(201).json({
        message: "Find Category!",
        category_name: services.rows[0].category_name,
    });
});

serviceRoutes.post("/books", async (req: Request, res: Response) => {
    const { serviceId } = req.body;

    const getCategory = await dbClient.query(
        `SELECT id, category_name FROM service_category WHERE id = $1;`,
        [serviceId]
    );

    if (getCategory.rows.length === 0) {
        res.status(400).json({ message: "Service Category doesn't exist!" });
        return;
    }

    const getPlan = await dbClient.query(
        `SELECT * FROM service_plan WHERE service_category_id = $1;`,
        [serviceId]
    );

    if (getPlan.rows.length === 0) {
        res.status(400).json({ message: "Service Plan doesn't exist!" });
        return;
    }

    const getRegion = await dbClient.query(
        `SELECT id,region_name FROM service_region;`
    );

    if (getRegion.rows.length === 0) {
        res.status(400).json({ message: "Service Region doesn't exist!" });
        return;
    }

    res.status(201).json({
        message: "find data!",
        categories: {
            id: getCategory.rows[0].id,
            name: getCategory.rows[0].category_name,
        },
        plans: getPlan.rows,
        regions: getRegion.rows,
    });
});

serviceRoutes.post("/providers", async (req: Request, res: Response) => {
    const { category, region, date, timeSection } = req.body;
    const weeksDays = new Date(Date.parse(date)).getDay();

    const getProvider = await dbClient.query(
        `
        SELECT t5.id AS provider_id, t5.full_name AS provider_name, t5.avatar AS provider_avatar, 
        t1.service_category_id AS category, t2.service_region_id AS region, t3.weekdays_available_id AS weekdays, 
        t4.time_section_id AS time_section
        FROM service_category_mapping t1 
        INNER JOIN service_region_mapping t2
        ON t1.service_provider_id = t2.service_provider_id
        INNER JOIN weekdays_mapping t3
        ON t2.service_provider_id = t3.service_provider_id
        INNER JOIN time_section_mapping t4
        ON t3.service_provider_id = t4.service_provider_id
        INNER JOIN service_provider t5
        ON t4.service_provider_id = t5.id
        WHERE t1.service_category_id = $1 
        and t2.service_region_id = $2
        and t3.weekdays_available_id = $3
        and t4.time_section_id = $4
        and t5.is_available = true;
        `,
        [category, region, weeksDays, timeSection]
    );

    if (getProvider.rows.length === 0) {
        res.status(201).json({
            message:
                "sorry, no one can provide services, please change your time or date.",
        });
        return;
    }

    res.status(200).json({
        message: "find provider!",
        providers: getProvider.rows,
    });
});

serviceRoutes.post("/orderInfo", async (req: Request, res: Response) => {
    const { category, timeSection, providerId, plan, region } =
        req.body.userChose;

    const getData = await dbClient.query(
        `
        SELECT t1.category_name,
        t2.time_section, 
        t3.full_name AS provider_name, t3.avatar AS provider_avatar, 
        t4.id AS plan_id, t4.plan_hour, t4.plan_price, t4.plan_description,
        t5.region_name
        FROM service_category t1, time_section t2, service_provider t3, service_plan t4, service_region t5 
        WHERE t1.id = $1 and t2.id = $2 and t3.id = $3 and t4.id = $4 and t5.id = $5;
        `,
        [category, timeSection, providerId, plan, region]
    );

    if (getData.rows.length === 0) {
        res.status(400).json({ message: "doesn't exist!" });
        return;
    }

    res.status(201).json({
        message: "success",
        data: getData.rows[0],
    });
});

serviceRoutes.post("/ConfirmOrder", async (req: Request, res: Response) => {
    try {
        const {
            service_date,
            service_start_time,
            service_user_full_name,
            service_user_phone_no,
            service_user_service_region,
            service_user_address,
            service_user_payment,
            order_total_amount,
            service_provider_id,
            service_provider_full_name,
            service_provider_avatar,
            service_name,
            service_plan_id,
            service_plan_hour,
            service_plan_price,
            service_plan_description,
            user_remark,
        } = req.body;

        const userId = req.session["user"]?.id;

        if (
            !service_date ||
            !service_start_time ||
            !service_user_full_name ||
            !service_user_phone_no ||
            !service_user_service_region ||
            !service_user_address ||
            !service_user_payment ||
            !order_total_amount ||
            !service_provider_id ||
            !service_provider_full_name ||
            !service_provider_avatar ||
            !service_name ||
            !service_plan_id ||
            !service_plan_hour ||
            !service_plan_price ||
            !service_plan_description
        ) {
            res.status(400).json({ message: "missing some data" });
            return;
        }

        // update user info
        await dbClient.query(
            `UPDATE service_user SET full_name = $2, phone_no = $3, service_region = $4, address = $5  WHERE id = $1;`,
            [
                userId,
                service_user_full_name,
                service_user_phone_no,
                service_user_service_region,
                service_user_address,
            ]
        );

        // create new order
        const orderId = _uuid();
        await dbClient.query(
            `INSERT INTO orders (
                order_id,
                status,
                selected_date,
                service_start_time,
                service_user_id,
                service_user_full_name,
                service_user_phone_no,
                service_region,
                service_user_address,
                service_user_payment,
                service_user_remark,
                service_provider_id,
                service_provider_full_name,
                service_provider_avatar,
                service_name,
                service_plan_id,
                service_plan_hour,
                service_plan_price,
                service_plan_description,
                order_total_amount,
                service_type_id
            ) VALUES ($1, 'pending', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 0);`,
            [
                orderId,
                service_date,
                service_start_time,
                userId,
                service_user_full_name,
                service_user_phone_no,
                service_user_service_region,
                service_user_address,
                service_user_payment,
                user_remark,
                service_provider_id,
                service_provider_full_name,
                service_provider_avatar,
                service_name,
                service_plan_id,
                service_plan_hour,
                service_plan_price,
                service_plan_description,
                order_total_amount,
            ]
        );

        res.status(201).json({ message: "Create Order!", orderId });
    } catch (ex) {
        console.log(ex);
        res.status(400).json({ message: "Something Wrong" });
    }
});

function _uuid() {
    var d = Date.now();
    if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
    ) {
        d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
    );
}
