/*import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('registerUser', () => {
  let controller: UserController
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    }).compile()

    service = module.get<UserService>(UserService)
    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('registerUser', () => {
    it('should register new user', async () => {
        const mockUser = {
            username: 'user123',
            password: 'password123',
            userType: 'basic'
        }

        const mockResponse = {
            message: 'User registered successfully',
            user: mockUser
        }

        jest.spyOn(UserService, 'findByUsername').mockResolvedValue(null)
        jest.spyOn(UserService, 'createUser').mockResolvedValue(mockUser)
    })
  })
}) */