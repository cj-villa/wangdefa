import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import bodyParser from 'body-parser';
import bodyParserXml from 'body-parser-xml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  bodyParserXml(bodyParser);
  app.use(
    bodyParser.xml({
      limit: '1mb',
      xmlParseOptions: {
        explicitArray: false, // <tag>value</tag> → tag: value
        normalizeTags: false,
        trim: true,
      },
      type: ['application/xml', 'text/xml'],
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString('utf8');
      },
    })
  );

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('env.port') ?? 80;

  await app.listen(port).then(() => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}

bootstrap();
