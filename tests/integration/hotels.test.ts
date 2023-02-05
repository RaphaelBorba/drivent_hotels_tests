import app, { init } from "@/app"
import supertest from "supertest"
import { cleanDb } from "../helpers"


beforeAll(async()=>{
    await init()
    await cleanDb()
})

const server = supertest(app)

describe("GET /hotels", ()=>{

    
})