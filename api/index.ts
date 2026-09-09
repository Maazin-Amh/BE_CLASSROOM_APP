import path from 'path';

process.env.NODE_PATH = path.join(process.cwd(), 'src');

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();

let initialized = false;

async function bootstrap() {
  if (!initialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.enableCors();

    await app.init();

    initialized = true;
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
