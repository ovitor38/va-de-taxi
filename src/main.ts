import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const options = { cors: true };

async function bootstrap() {
  const app = await NestFactory.create(AppModule, options);
  const port = process.env.PORT || 8000;

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);

  console.log(`Server is running on port: ${port} 🚀`);
}
bootstrap();
