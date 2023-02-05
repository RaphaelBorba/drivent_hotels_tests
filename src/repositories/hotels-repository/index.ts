import { prisma } from "@/config";


export function getHotelsDB(){

    return prisma.hotel.findMany()
}

export function getHotelByIdDB(hotelId: number){

    return prisma.hotel.findFirst({
        where:{id:hotelId},
        include:{
            Rooms:true
        }
    })
}