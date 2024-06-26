import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from 'mongoose'
import { Movie, MovieDocument } from './movies.model'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

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
      try {
        const apiKey = process.env.OMDB_API_KEY
        if (!apiKey) {
          throw new Error('API KEY is not defined')
        }

        const omdbResponse = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
        if (omdbResponse.status === 200 && omdbResponse.data.Response !== 'False') {
          return omdbResponse.data;
        } else {
          // if status isnt 200 or api response is false - means there is nothing to fetch
          throw new Error(omdbResponse.data.Error || 'Error fetching movie details');
        }
      } catch (error) {
        // error handling
        console.error(`Failed to fetch movie details for title: ${title}`, error);
        throw new Error(`Failed to fetch movie details: ${error.message}`);
      }
    }
}