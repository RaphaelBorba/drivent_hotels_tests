import { AuthenticatedRequest } from "@/middlewares";
import { getHotelsDB } from "@/repositories/hotels-repository";
import { Response } from "express";
import enrollmentRepository from '@/repositories/enrollment-repository'
import ticketRepository from '@/repositories/ticket-repository'



export async function getHotels(req: AuthenticatedRequest, res:Response){
    
    const {userId} = req
    
    try {

        const enrollment = await enrollmentRepository.findById(userId)

        if(!enrollment) return res.sendStatus(404)

        const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)

        if(!ticket) return res.sendStatus(404)
        
        const hotels = await getHotelsDB()

        if(!hotels) return res.sendStatus(404)

        res.status(200).send(hotels)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }


}