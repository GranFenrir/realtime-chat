import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    });
    await app.listen(3003); 
    console.log('Server is running on http://localhost:3003');
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}
bootstrap();