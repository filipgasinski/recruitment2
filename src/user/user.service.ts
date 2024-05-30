import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser(username: string, password: string, userType: string): Promise<User> {
    const hashedPassword = await this.hashPassword(password)
    const newUser = new this.userModel({ username, password: hashedPassword, userType });
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async validatePassword(enteredPassword: string, userPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, userPassword)
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
  }

}
