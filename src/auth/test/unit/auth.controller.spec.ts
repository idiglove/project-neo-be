import {Test, TestingModule} from "@nestjs/testing"
import {JwtService} from "@nestjs/jwt"
import {ConfigService} from "@nestjs/config"
import {ForbiddenException} from "@nestjs/common"

import {AuthController} from "../../auth.controller"
import {AuthService} from "../../auth.service"
import {PrismaService} from "../../../prisma/prisma.service"
import {AuthDto} from "../../dto"

describe("AuthController", () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService, JwtService, ConfigService]
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  const dto: AuthDto = {
    email: "mail@gmail.com",
    password: "P!assword1234"
  }

  describe("Sign up", () => {
    it("should throw if email is empty", async () => {
      const req = {
        email: "",
        password: dto.password
      }
      jest.spyOn(authService, "signup").mockRejectedValue({statusCode: 400})
      await expect(authController.signup(req)).rejects.toEqual(
        expect.objectContaining({statusCode: 400})
      )
    })

    it("should throw if password is empty", async () => {
      const req = {
        email: dto.email,
        password: ""
      }
      jest.spyOn(authService, "signup").mockRejectedValue({statusCode: 400})
      await expect(authController.signup(req)).rejects.toEqual(
        expect.objectContaining({statusCode: 400})
      )
    })

    it("should throw if password is not strong", async () => {
      const req = {
        email: dto.email,
        password: "Password123"
      }
      jest.spyOn(authService, "signup").mockRejectedValue({statusCode: 400})
      await expect(authController.signup(req)).rejects.toEqual(
        expect.objectContaining({statusCode: 400})
      )
    })

    it("should throw if body is empty", async () => {
      const req = {
        email: "",
        password: ""
      }
      jest.spyOn(authService, "signup").mockRejectedValue({statusCode: 400})
      await expect(authController.signup(req)).rejects.toEqual(
        expect.objectContaining({statusCode: 400})
      )
    })

    it("should throw if user is already registered", async () => {
      jest.spyOn(authService, "signup").mockRejectedValue(
        new ForbiddenException({
          statusCode: 403,
          message: "Credentials taken",
          error: "Forbidden"
        })
      )
      await expect(authController.signup(dto)).rejects.toThrow(
        ForbiddenException
      )
    })

    it("should signup", async () => {
      jest
        .spyOn(authService, "signup")
        .mockResolvedValue({status: "Sign up success!"})
      await expect(authController.signup(dto)).resolves.toEqual({
        status: "Sign up success!"
      })
    })
  })

  describe("Sign in", () => {
    it("should throw if email is empty", async () => {
      const req = {
        email: "",
        password: dto.password
      }

      jest.spyOn(authService, "signin").mockRejectedValue({statusCode: 400})
      await expect(authController.signin(req)).rejects.toEqual(
        expect.objectContaining({statusCode: 400})
      )
    })

    it("should throw if password is empty", async () => {
      const req = {
        email: dto.email,
        password: ""
      }

      jest.spyOn(authService, "signin").mockRejectedValue({statusCode: 400})
      await expect(authController.signin(req)).rejects.toEqual(
        expect.objectContaining({statusCode: 400})
      )
    })

    it("should throw if body is empty", async () => {
      const req = {
        email: "",
        password: ""
      }

      jest.spyOn(authService, "signin").mockRejectedValue({statusCode: 400})
      await expect(authController.signin(req)).rejects.toEqual(
        expect.objectContaining({statusCode: 400})
      )
    })

    it("should signin", async () => {
      jest
        .spyOn(authController, "signin")
        .mockResolvedValue({accessToken: "test"})

      await expect(authController.signin(dto)).resolves.toEqual({
        accessToken: "test"
      })
    })
  })
})
