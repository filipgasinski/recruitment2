import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type MovieDocument = Movie & Document

@Schema()
export class Movie {
    save(save: any) {
        throw new Error('Method not implemented.')
    }
    @Prop()
    title: string

    @Prop()
    released: Date

    @Prop()
    genre: string

    @Prop()
    director: string

    @Prop({ type: Date, default: Date.now }) 
    createdAt: Date

    @Prop({ type: String, ref: 'User' })
    userId: string
}

export const MovieSchema = SchemaFactory.createForClass(Movie)