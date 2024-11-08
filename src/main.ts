import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserExceptionFilter } from './common/filters/user-exception.filter';

const options = { cors: true };
const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, options);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new UserExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Documentação com Swagger - Va de taxi Test')
    .setDescription(
      'O Swagger (aka OpenApi) é uma biblioteca muito conhecida no universo backend, estando disponível para diversas linguagens e frameworks. Ela gera um site interno no seu backend que descreve, com muitos detalhes, cada endpoint e estrutura de entidades presentes na sua aplicação.',
    )
    .setVersion('1.0')
    .addTag('passenger')
    .addTag('driver')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(port);
  console.log(`Server is running on port: ${port} 🚀`);
}
bootstrap();
