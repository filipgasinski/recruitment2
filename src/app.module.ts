// https://medium.com/@nandhakumar.io/nestjs-how-to-store-read-and-validate-environment-variable-using-nestjs-config-40a5fa0702e4 
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
import { ConfigModule, ConfigService } from '@nestjs/config'; // Biblioteka z nesta co sprawdza konfigurację
import { validate } from './env.validation';
import { DatabaseConfigService } from './config/database-config.service';

dotenv.config()

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), // W tym przypadku - Sprawdza pliki ENV 
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    UserModule,
    moviesModule
  ],
  controllers: [UserController, moviesController],
  providers: [UserService, MoviesService, DatabaseConfigService],
})
export class AppModule {}
