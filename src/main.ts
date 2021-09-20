import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { RavenInterceptor } from 'nest-raven';
import * as fs from 'fs';

declare const module: any;

async function bootstrap() {
  let app;

  if (process.env.NODE_ENV === 'development') {
    app = await NestFactory.create(AppModule, { cors: true });
  } else if (process.env.NODE_ENV === 'production') {
    const httpsOptions = {
      key: fs.readFileSync(process.env.HTTPS_KEY),
      cert: fs.readFileSync(process.env.HTTPS_CERT),
    };
    app = await NestFactory.create(AppModule, {
      cors: true,
      httpsOptions,
    });
  }
  const port = process.env.SERVICE_PORT || 4000;

  Sentry.init({
    dsn: process.env.SENTRY_KEY,
  });
  app.useGlobalInterceptors(new RavenInterceptor());

  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Shoppingmall API')
    .setDescription('Shoppingmall REST API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
