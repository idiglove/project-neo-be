import {Test, TestingModule} from "@nestjs/testing"
import {UserController} from "../../user.controller"
import {UserService} from "../../user.service"

describe("UserController", () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    }).compile()

    userController = module.get<UserController>(UserController)
    userService = module.get<UserService>(UserService)
  })

  it.todo("Get user should throw if invalid access token")
  it.todo("Get users should throw if not admin")
  it.todo("Get user")
  it.todo("Get users")
  it.todo("Set as admin")
  it.todo("Set as trainee")
})
