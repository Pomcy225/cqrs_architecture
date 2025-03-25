import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation lebedoo')
    .setDescription('Documentation pour API lebedoo')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Route où Swagger sera disponible


    
  app.enableCors({
    origin: '*', // Permet toutes les origines (à restreindre en production)
    methods: 'GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(3000);
}
bootstrap();
