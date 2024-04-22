import { Controller } from '@nestjs/common';
import { MovieService } from '../movies/movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private readonly movieService: MovieService) {}
}
