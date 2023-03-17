import {ForbiddenException, Injectable} from "@nestjs/common"
import {AuthDto} from "./dto"
import * as argon from "argon2"
import {PrismaService} from "../prisma/prisma.service"
import {JwtService} from "@nestjs/jwt"
import {ConfigService} from "@nestjs/config"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password)

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash
        }
      })

      return this.signToken(user.id, user.email)
    } catch (error) {
      if (error.code === "P2002") {
        throw new ForbiddenException("Credentials taken")
      }
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    if (!user) throw new ForbiddenException("Credentials incorrect")

    const isPwdMatch = await argon.verify(user.hash, dto.password)
    if (!isPwdMatch) throw new ForbiddenException("Password incorrect")

    return this.signToken(user.id, user.email)
  }

  async signToken(
    userId: string,
    email: string
  ): Promise<{accessToken: string}> {
    const payload = {
      sub: userId,
      email
    }

    const secret = this.config.get("JWT_SECRET")

    const token = await this.jwt.signAsync(payload, {
      expiresIn: "10m",
      secret: secret
    })

    return {
      accessToken: token
    }
  }
}
