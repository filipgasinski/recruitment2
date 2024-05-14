import { Controller, Post, Get, Param, Body, Res, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { MoviesService } from './movies.service'

@Controller('movies')
export class moviesController {
    constructor(private readonly moviesService: MoviesService) {}

    // Endpoint - creating movies
    @Post('/createMovie') // */movies/createMovie
    async createMovie(
        @Body('title') title: string,
        @Body('userId') userId: string,
        @Res() res: Response
    ) {
        try {
            const newMovie = await this.moviesService.createMovie(title, userId)
            res.status(HttpStatus.CREATED).json({ message: 'Movie created successfully', movie: newMovie })
        } catch (error) {
            console.error('Error creating movie: ', error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
        }
    }

    // Endpoint - GET all userID movies
    @Get(':userId') // */movies/userID
    async getMoviesByUserId(@Param('userId') userId: string, @Res() res: Response) {
        try {
            const movies = await this.moviesService.getMoviesByUserId(userId)
            res.status(HttpStatus.OK).json({ movies })
        } catch (error) {
            console.error('Error fetching movies: ', error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
        }
    }
}