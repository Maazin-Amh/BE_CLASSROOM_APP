import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();

let isInitialized = false;

async function bootstrap() {
  if (!isInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.enableCors();

    await app.init();

    isInitialized = true;
  }

  return server;
}

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  const app = await bootstrap();
  return app(req, res);
}
