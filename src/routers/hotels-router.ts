import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels } from "@/controllers/hotels-controller";

const hotelRouter = Router()

hotelRouter
    .use(authenticateToken)
    .get("", getHotels)
    .get("/:id", (req, res) => res.status(200).send(req))

export { hotelRouter }