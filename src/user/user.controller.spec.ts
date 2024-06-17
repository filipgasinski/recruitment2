import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.model';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserService = {
  findAll: jest.fn(),
  findByUsername: jest.fn(),
  createUser: jest.fn(),
  validatePassword: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ username: 'test', password: 'test', userType: 'basic' }];
      mockUserService.findAll.mockResolvedValue(result);

      expect(await userController.findAll()).toBe(result);
    });
  });

  describe('authenticateUser', () => {
    it('should return user ID if username and password are correct', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { _id: '1', username: 'test', password: await bcrypt.hash('password', 10), userType: 'basic' };
      mockUserService.findByUsername.mockResolvedValue(user);
      mockUserService.validatePassword.mockResolvedValue(true);

      await userController.authenticateUser({ username: 'test', password: 'password' }, res as any);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: { userId: '1' } });
    });

    it('should return error if username is incorrect', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockUserService.findByUsername.mockResolvedValue(null);

      await userController.authenticateUser({ username: 'wrong', password: 'password' }, res as any);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Invalid username or password' });
    });

    it('should return error if password is incorrect', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { _id: '1', username: 'test', password: await bcrypt.hash('password', 10), userType: 'basic' };
      mockUserService.findByUsername.mockResolvedValue(user);
      mockUserService.validatePassword.mockResolvedValue(false);

      await userController.authenticateUser({ username: 'test', password: 'wrongpassword' }, res as any);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Invalid username or password' });
    });
  });

  describe('registerUser', () => {
    it('should create a user and return success message', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { username: 'test', password: 'password', userType: 'basic' };
      mockUserService.findByUsername.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue(user);

      await userController.registerUser({ username: 'test', password: 'password', userType: 'basic' }, res as any);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully', user });
    });

    it('should return error if username already exists', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { username: 'test', password: 'password', userType: 'basic' };
      mockUserService.findByUsername.mockResolvedValue(user);

      await userController.registerUser({ username: 'test', password: 'password', userType: 'basic' }, res as any);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
    });

    it('should return internal server error for other errors', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockUserService.findByUsername.mockRejectedValue(new Error('some error'));

      await userController.registerUser({ username: 'test', password: 'password', userType: 'basic' }, res as any);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
