import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Environment variables
    const port = process.env.PORT || 3006;
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    
    // CORS origin'leri array'e çevir (virgülle ayrılmışsa)
    const allowedOrigins = corsOrigin.split(',').map(origin => origin.trim());
    
    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    });

    // Add proper shutdown handlers
    const server = await app.listen(port);
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`🔗 CORS enabled for: ${corsOrigin}`);
    
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