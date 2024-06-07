// Opisujemy jak validujemy nasze environment variables (jakie envy, jak zapisane, itd.)
import { IsString , validateSync} from 'class-validator';
import { plainToClass } from 'class-transformer';

class EnvironmentVariables { // Wrzucamy jakie mamy envy i jak mają być validowane
  @IsString({ message: 'Invalid OMDB_API_KEY' })
  OMDB_API_KEY: string;

  @IsString({ message: 'Invalid MONGODB_URL' })
  MONGODB_URL: string;
}

export const validate = (config: Record<string, unknown>) => {
  
    // `plainToClass` to converts plain object into Class
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
      enableImplicitConversion: true,
    });
   
    // `validateSync` method validate the class and returns errors
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });
  
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  };