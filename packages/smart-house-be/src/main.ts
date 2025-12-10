import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8000).then(() => {
    console.log('Application is running on: http://localhost:8000');
  });
}

bootstrap();
