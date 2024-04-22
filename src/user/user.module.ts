import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.model'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Importowanie modelu do MongooseModule
  ],
  controllers: [UserController], // Importowanie kontrolera
  providers: [UserService], // Importowanie usługi
})
export class UserModule {}
