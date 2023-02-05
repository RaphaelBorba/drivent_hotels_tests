import { prisma } from "@/config";
import faker from "@faker-js/faker";

export function createRoom(hotelId: number){

    return prisma.room.create({
        data:{
            name:faker.name.jobArea(),
            capacity: faker.datatype.number({max:10}),
            hotelId,
        }
    })
}