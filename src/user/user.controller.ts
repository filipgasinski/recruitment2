import { Controller, Get, Post, Body, Res, HttpStatus, ConflictException } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // */users
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Endpoint - user authentication
  @Post('/auth') // */users/auth
  async authenticateUser(@Body() body: any, @Res() res: Response) {
    try {
      const { username, password } = body;

      // Find user by username
      const user = await this.userService.findByUsername(username);

      // Checking if user exists
      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: 'Invalid username or password' })
      }

      // Checking if password is correct
      const isPasswordCorrect = await this.userService.validatePassword(password, user.password)
      if (!isPasswordCorrect) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: 'Invalid username or password' })
      }

      // Return success reponse with user ID
      res.status(HttpStatus.OK).json({ success: true, data: { userId: user._id } })
    } catch (error) {
      console.error('Error authenticating user: ', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
  }

  // Endpoint - registrating user
  @Post('/registration') // */users/registration 
  async registerUser(@Body() body: any, @Res() res: Response) {
    try {
      const { username, password, userType } = body;

      // Checking if username already exists
      const existingUser = await this.userService.findByUsername(username);
      if(existingUser) {
        throw new ConflictException('Username already exists'); 
      }

      // Creating new user
      const newUser = await this.userService.createUser(username, password, userType);
      
      res.status(HttpStatus.CREATED).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Error registering user: ', error);
      if (error instanceof ConflictException) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
      }
    }
  }
}
