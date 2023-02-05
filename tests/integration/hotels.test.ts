import app, { init } from "@/app"
import httpStatus from "http-status"
import supertest from "supertest"
import { createEnrollmentWithAddress, createTicketType, createUser, createTicket } from "../factories"
import { cleanDb, generateValidToken } from "../helpers"
import * as jwt from "jsonwebtoken";
import faker from "@faker-js/faker";
import { Hotel, TicketStatus } from "@prisma/client"
import { createHotel } from "../factories/hotels-factory"
import { prisma } from "@/config"
import { createRoom } from "../factories/rooms-factory"

beforeAll(async () => {
    await init();
});
beforeEach(async()=>{
    await cleanDb();
})


const server = supertest(app)

describe("GET /hotels", () => {

    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {

        it("should respond with status 404 when there isn't enrollment for given user ", async () => {
            const token = await generateValidToken();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(404);
        });

        it("should respond with status 404 when there isn't ticket for given user", async () => {
            const token = await generateValidToken();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
        it("should respond with status 404 when there isn't hotel", async () => {
            const token = await generateValidToken();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
        it("should respond with status 402 when user ticket status equal to 'Reserved', 'isRemote' equal to true or 'includesHotel' equal to false", async () => {

            const user = await createUser();
            const token = await generateValidToken(user);
            const ticketType = await createTicketType();
            const enrollment = await createEnrollmentWithAddress(user)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(402)
        })
        it("should respond hotel data with status 200", async () => {

            const user = await createUser();
            const token = await generateValidToken(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                },
            });
            const enrollment = await createEnrollmentWithAddress(user)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel() as Hotel
            const hotel2 = await createHotel() as Hotel

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200)
            expect(response.body).toEqual([
                {
                    id: hotel.id,
                    name: hotel.name,
                    image: hotel.image,
                    updatedAt: hotel.updatedAt.toISOString(),
                    createdAt: hotel.createdAt.toISOString(),
                },
                {
                    id: hotel2.id,
                    name: hotel2.name,
                    image: hotel2.image,
                    updatedAt: hotel2.updatedAt.toISOString(),
                    createdAt: hotel2.createdAt.toISOString(),
                },
            ])
        })

    });
})

describe("Get /hotels/:id", () => {

    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels/1");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });


    describe("when token is valid", () => {

        it("should respond with status 404 when there isn't enrollment for given user ", async () => {
            const token = await generateValidToken();

            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(404);
        });

        it("should respond with status 404 when there isn't ticket for given user", async () => {
            const token = await generateValidToken();

            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
        it("should respond with status 404 when there isn't hotel with this id", async () => {
            const token = await generateValidToken();

            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
        it("should respond with status 402 when user ticket status equal to 'Reserved', 'isRemote' equal to true or 'includesHotel' equal to false", async () => {

            const user = await createUser();
            const token = await generateValidToken(user);
            const ticketType = await createTicketType();
            const enrollment = await createEnrollmentWithAddress(user)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(402)
        })
        it("should response with hotelId data and status 200", async () => {

            const user = await createUser();
            const token = await generateValidToken(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                },
            });
            const enrollment = await createEnrollmentWithAddress(user)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const hotel = await createHotel()
            const room = await createRoom(hotel.id)

            const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
            console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                createdAt: hotel.createdAt.toISOString(),
                id: hotel.id,
                image: hotel.image,
                name: hotel.name,
                updatedAt: hotel.updatedAt.toISOString(),
                Rooms: [
                    {
                        capacity: room.capacity,
                        createdAt: room.createdAt.toISOString(),
                        hotelId: room.hotelId,
                        id: room.id,
                        name: room.name,
                        updatedAt: room.updatedAt.toISOString(),
                    }
                ]
            })
        })
    })
})