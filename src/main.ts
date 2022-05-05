import { TransformInterceptor } from './jsendTransform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SentryService } from '@ntegral/nestjs-sentry';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useLogger(SentryService.SentryServiceInstance());
  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Bitfigo API')
    .setDescription('Bitfigo marketplace description')
    .setVersion('1.0')
    .addTag('bitfigo')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  app.enableCors();

  await app.listen(1313);
}
bootstrap();
