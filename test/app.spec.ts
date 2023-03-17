import {Test, TestingModule} from "@nestjs/testing"
import {INestApplication, ValidationPipe} from "@nestjs/common"
import * as request from "supertest"
import * as pactum from "pactum"
import {AppModule} from "./../src/app.module"
import {PrismaService} from "../src/prisma/prisma.service"
import {AuthDto} from "../src/auth/dto"
import {AppService} from "src/app.service"
import {AppController} from "src/app.controller"

describe("AppController", () => {
  let appController: AppController
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile()

    appController = app.get<AppController>(AppController)
  })
})
describe("AppController (e2e)", () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    )
    await app.init()
    await app.listen(4000)

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl("http://localhost:4000")
  })

  afterAll(() => {
    app.close()
  })

  describe("Auth", () => {
    const dto: AuthDto = {
      email: "mail@gmail.com",
      password: "P!assword1234"
    }

    describe("Signup", () => {
      it("should throw if email empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
      })

      it("should throw if password empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
      })

      it("should throw if no body provided", () => {
        return pactum.spec().post("/auth/signup").expectStatus(400)
      })

      it("shoud signup", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(201)
      })
    })

    describe("Sign in", () => {
      it("should throw if email empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
      })

      it("should throw if password empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
      })

      it("should throw if no body provided", () => {
        return pactum.spec().post("/auth/signin").expectStatus(400)
      })

      it("shoud signin", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody(dto)
          .expectStatus(201)
      })
    })
  })
})
