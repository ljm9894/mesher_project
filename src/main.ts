import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipeSetting } from './global/validator/request.validator';
import { ExceptionFilter } from './global/exception/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(ValidationPipeSetting);
  app.useGlobalFilters(new ExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Mesher')
    .setDescription('Mesher API Description')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('PORT'));
  Logger.log(
    `http://localhost:${configService.get<number>('PORT')} wating server...`,
  );
}
bootstrap();
