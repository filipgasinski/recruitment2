import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { moviesController } from "./movies.controller"
import { MoviesService } from "./movies.service"
import { Movie, MovieSchema } from "./movies.model"

@Module({
    imports: [MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }])],
    controllers: [moviesController],
    providers: [MoviesService],
})
export class moviesModule {}