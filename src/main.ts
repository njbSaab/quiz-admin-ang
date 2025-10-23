import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Включение CORS с указанием разрешенных доменов
  app.enableCors({
    origin: ['https://1xarea.com', 'http://localhost:4200', 'http://localhost:60750'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // Глобальный префикс для API
  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.enableShutdownHooks();

  const port = process.env.PORT ?? 4444;
  await app.listen(port);

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Quiz API')
    .setDescription('API for managing quizzes and user results')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'X-Secret-Word', in: 'header' },
      'secret-word',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  logger.log(`Swagger paths: ${JSON.stringify(Object.keys(document.paths))}`);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Quiz API Documentation',
  });

  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();