import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

const bootstrap = async () => {
  // Better Auth reads raw request bodies; AuthModule re-adds JSON parsing for other routes.
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableShutdownHooks();
  // Keep every response out of search indexes (robots.txt is served by RobotsController).
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
    next();
  });
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
};
await bootstrap();
