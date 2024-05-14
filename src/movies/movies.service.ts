import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from 'mongoose'
import { Movie, MovieDocument } from './movies.model'
import axios from 'axios'

@Injectable()
export class MoviesService {
    constructor(@InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>) {}

    async createMovie(title: string, userId: string, released?: Date, genre?: string, director?: string): Promise<Movie> {
        const movieDetails = await this.fetchMovieDetails(title); // Fetch movie details
        const { Title, Released, Genre, Director} = movieDetails
        const newMovie = new this.movieModel({
          title: Title,
          released: released || Released,
          genre: genre || Genre,
          director: director || Director,
          userId,
        });
        return newMovie.save();
      }
    
    async getMoviesByUserId(userId: string): Promise<Movie[]> {
        return this.movieModel.find({ userId }).exec()
    }

    private async fetchMovieDetails(title: string): Promise<any> {
        const omdbResponse = await axios.get('http://www.omdbapi.com/?i=tt3896198&apikey=a5bb452c');
        return omdbResponse.data;
      }
}