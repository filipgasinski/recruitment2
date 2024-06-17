import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MoviesService } from './movies.service';
import { Movie } from './movies.model';
import axios from 'axios';
import { Model } from 'mongoose';

jest.mock('axios');

describe('MoviesService', () => {
  let service: MoviesService;
  let model: Model<Movie>;

  const mockMovie = {
    title: 'Test Movie',
    released: new Date(),
    genre: 'Drama',
    director: 'Test Director',
    userId: 'testUserId',
    save: jest.fn()
  };

  const mockMovieModel: any = {
    save: jest.fn().mockResolvedValue(mockMovie),
    find: jest.fn(),
    exec: jest.fn(),
    constructor: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getModelToken('Movie'),
          useValue: mockMovieModel,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    model = module.get<Model<Movie>>(getModelToken('Movie'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMovie', () => {
    it('should create a movie', async () => {
      const movieDetails = {
        Title: 'Test Movie',
        Released: new Date(),
        Genre: 'Drama',
        Director: 'Test Director'
      };

      (axios.get as jest.Mock).mockResolvedValue({ status: 200, data: movieDetails });

      const result = await service.createMovie('Test Movie', 'testUserId');

      expect(result.title).toBe('Test Movie');
      expect(result.released).toBe(movieDetails.Released);
      expect(result.genre).toBe('Drama');
      expect(result.director).toBe('Test Director');
      expect(result.userId).toBe('testUserId');
    });

    it('should throw an error if movie details cannot be fetched', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ status: 200, data: { Response: 'False', Error: 'Movie not found!' } });

      await expect(service.createMovie('Nonexistent Movie', 'testUserId')).rejects.toThrow('Failed to fetch movie details: Movie not found!');
    });
  });

  describe('getMoviesByUserId', () => {
    it('should return an array of movies', async () => {
      const userId = 'testUserId';
      const movies = [mockMovie];
      mockMovieModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(movies) });

      const result = await service.getMoviesByUserId(userId);

      expect(result).toEqual(movies);
    });
  });
});
