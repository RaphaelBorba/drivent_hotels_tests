import { Router } from "express";
import { authenticateToken } from "@/middlewares";

const hotelRouter = Router()

hotelRouter
    .all('/*',authenticateToken)
    .get("", (req, res) => res.status(200).send('aqui'))
    .get("/:id", (req, res) => res.status(200).send(req.params))

export { hotelRouter }