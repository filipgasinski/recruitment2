import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User, UserSchema } from './user/user.model';
import { UserModule } from './user/user.module';
import { moviesController } from './movies/movies.controller';
import { MoviesService } from './movies/movies.service';
import { moviesModule } from './movies/movies.module';
import { Movie, MovieSchema } from './movies/movies.model';
import * as dotenv from 'dotenv';

dotenv.config()

const mongoUrl = process.env.MONGODB_URL
if (!mongoUrl) {
  throw new Error('MONGODB_URL is not defined')
}

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl), // Database connection
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    UserModule,
    moviesModule
  ],
  controllers: [UserController, moviesController],
  providers: [UserService, MoviesService],
})
export class AppModule {}
