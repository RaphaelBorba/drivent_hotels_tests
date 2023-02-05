import { prisma } from "@/config";
import faker from "@faker-js/faker";


export function createHotel(){

    return prisma.hotel.create({
        data:{
            name: faker.name.middleName(),
            image: faker.image.city(),
        }
        
    })
}

export type Hotel = {
    id: Number,
    name: String,
    image: String,
    createAt: Date,
    updateAt: Date
}