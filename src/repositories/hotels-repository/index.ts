import { prisma } from "@/config";


export function getHotelsDB(){

    return prisma.hotel.findMany()
}