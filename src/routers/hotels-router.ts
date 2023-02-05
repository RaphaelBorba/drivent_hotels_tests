import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelWithId } from "@/controllers/hotels-controller";

const hotelRouter = Router()

hotelRouter
    .use(authenticateToken)
    .get("", getHotels)
    .get("/:id", getHotelWithId)

export { hotelRouter }