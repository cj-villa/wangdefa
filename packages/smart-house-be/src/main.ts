import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import bodyParser from 'body-parser';
import bodyParserXml from 'body-parser-xml';
import { RequestContextInterceptor } from '@/interface/interceptor/request-context';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const whitelist = configService.get<string[]>('env.whitelist');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

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

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Wangdefa')
      .setDescription('接口文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);
  }

  const port = configService.get<number>('env.port') ?? 80;

  await app.listen(port).then(() => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}

bootstrap();
