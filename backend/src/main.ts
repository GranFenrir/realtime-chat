import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    });

    // Add proper shutdown handlers
    const server = await app.listen(3006);
    console.log('Server is running on http://localhost:3006');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Received SIGINT signal. Shutting down gracefully...');
      await server.close();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM signal. Shutting down gracefully...');
      await server.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}
bootstrap();