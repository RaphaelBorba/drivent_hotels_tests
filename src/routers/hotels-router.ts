import { Router } from "express";

const hotelRouter = Router()

hotelRouter
    .get("")
    .get("/:id")

export {hotelRouter}