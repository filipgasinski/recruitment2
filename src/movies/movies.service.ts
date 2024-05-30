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
      try {
        const omdbResponse = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=a5bb452c`);
        if (omdbResponse.status === 200 && omdbResponse.data.Response !== 'False') {
          return omdbResponse.data;
        } else {
          // if status isnt 200 or api response is false
          throw new Error(omdbResponse.data.Error || 'Error fetching movie details');
        }
      } catch (error) {
        console.error(`Failed to fetch movie details for title: ${title}`, error);
        throw new Error(`Failed to fetch movie details: ${error.message}`);
      }
    }
}