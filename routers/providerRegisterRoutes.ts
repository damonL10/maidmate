import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { Provider } from "../model";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { hashPassword } from "../hash";
export const providerRegisterRoutes = express.Router();

const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 2000 * 1024 ** 2, // the default limit is 200KB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
});


providerRegisterRoutes.get("/", getAllProviders);
providerRegisterRoutes.post("/", registerProvider);

async function getAllProviders(req: Request, res: Response) {
  const queryResult = await dbClient.query<Provider>("SELECT * FROM service_provider");
  res.json(queryResult.rows);
};

async function registerProvider(req: Request, res: Response) {

  form.parse(req, async (err, fields, files) => {
    const email = fields.email as string;
      if (!email) {
          res.status(400).json({message: "invalid input"});
          return;
      };
    const password = fields.password as string;
      if (!password) {
          res.status(400).json({message: "invalid input"});
          return;
      };
    const full_name = fields.full_name as string;
      if (!full_name) {
          res.status(400).json({message: "invalid input"});
          return;
      };
    const phone_no = fields.phone_no as string;
      if (!phone_no) {
          res.status(400).json({message: "invalid input"});
          return;
      };
    
    const avatar = (files["avatar"]as formidable.File)?.newFilename;
    if (!avatar) {
      res.status(400).json({message: "invalid input"});
      return;
  };
    const service_category = JSON.parse(fields.service_category as string);
    const service_region = JSON.parse(fields.service_region as string);
    const weekdays = JSON.parse(fields.weekdays as string);
    const time_section = JSON.parse(fields.time_section as string);

    const hashedPassword = await hashPassword(password);
    const providerInfoQueryResult = await dbClient.query(
            /*sql*/ `INSERT INTO service_provider (email, password, full_name, phone_no, avatar, is_available) VALUES ($1, $2, $3, $4, $5, true) RETURNING id`,
      [email, hashedPassword, full_name, phone_no, avatar]
    );

    let providerId = providerInfoQueryResult.rows[0].id;
    for (const num of service_category) {
      const insertSql = /*sql*/ `INSERT INTO service_category_mapping (service_provider_id, service_category_id) VALUES ($1, $2)`;
      const serviceCategoryQueryResult = await dbClient.query(insertSql, [providerId, num]);
      console.log(serviceCategoryQueryResult.rows);
    };
    for (const num of service_region) {
      // console.log("step6: region is", providerId, num);
      const insertSql = /*sql*/ `INSERT INTO service_region_mapping (service_provider_id, service_region_id) VALUES ($1, $2)`;
      const serviceRegionQueryResult = await dbClient.query(insertSql, [providerId, num]);
      console.log(serviceRegionQueryResult.rows);
    };
    for (const num of weekdays) {
      // console.log("step5: weekdays is", providerId, num);
      const insertSql = /*sql*/ `INSERT INTO weekdays_mapping (service_provider_id, weekdays_available_id) VALUES ($1, $2)`;
      const weekdaysQueryResult = await dbClient.query(insertSql, [providerId, num]);
      console.log(weekdaysQueryResult)
    };
    for (const num of time_section) {
      // console.log("step5: time_section is", providerId, num);
      const insertSql = /*sql*/ `INSERT INTO time_section_mapping (service_provider_id, time_section_id) VALUES ($1, $2)`;
      const timeSectionQueryResult = await dbClient.query(insertSql, [providerId, num]);
      console.log(timeSectionQueryResult)
    };

    res.send("successfully registered!")
  })
};