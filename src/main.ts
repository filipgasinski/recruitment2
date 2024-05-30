import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey: string | undefined = process.env.OMDB_API_KEY;
if(!apiKey) {
  throw new Error('OMDB API KEY is not defined')
}
console.log(`You API key is: ${apiKey}`)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
