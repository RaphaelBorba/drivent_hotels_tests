import { AuthenticatedRequest } from "@/middlewares";
import { getHotelsDB, getHotelByIdDB } from "@/repositories/hotels-repository";
import { Response } from "express";
import enrollmentRepository from '@/repositories/enrollment-repository'
import ticketRepository from '@/repositories/ticket-repository'



export async function getHotels(req: AuthenticatedRequest, res: Response) {

    const { userId } = req

    try {

        const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

        if (!enrollment) return res.sendStatus(404)

        const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)

        if (!ticket) return res.sendStatus(404)

        if (ticket.status !== 'PAID' || ticket.TicketType.includesHotel === false || ticket.TicketType.isRemote === true) {
            return res.sendStatus(402)
        }

        const hotels = await getHotelsDB()

        if (!hotels) return res.sendStatus(404)
        
        res.status(200).send(hotels)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }


}

export async function getHotelWithId(req: AuthenticatedRequest, res:Response){

    const { userId } = req
    const {id} = req.params

    try {

        const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

        if (!enrollment) return res.sendStatus(404)

        const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)

        if (!ticket) return res.sendStatus(404)

        if (ticket.status !== 'PAID' || ticket.TicketType.includesHotel === false || ticket.TicketType.isRemote === true) {
            return res.sendStatus(402)
        }

        const hotels = await getHotelByIdDB(Number(id))

        if (!hotels) return res.sendStatus(404)
        
        res.status(200).send(hotels)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}