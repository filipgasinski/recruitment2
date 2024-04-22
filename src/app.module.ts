import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User, UserSchema } from './user/user.model';
import { UserModule } from './user/user.module';
import { MoviesController } from './movies/movies.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://dbUser:haslo123@cluster0.tfbwlcs.mongodb.net/'), // Database connection
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
  ],
  controllers: [UserController, MoviesController],
  providers: [UserService],
})
export class AppModule {}
