import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from 'src/app';
import { ExceptionsCatchFilter } from './filter/exceptions-catch';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsCatchFilter(httpAdapter));

  await app.listen(3000);
}

bootstrap();
