import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger('Wangdefa'),
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('env.port') ?? 80;
  await app.listen(port).then(() => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}

bootstrap();
