import { Controller, Get, Header } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

// The API isn't for crawlers; main.ts also sends X-Robots-Tag on every response.
@AllowAnonymous()
@Controller('robots.txt')
export class RobotsController {
  @Get()
  @Header('Content-Type', 'text/plain; charset=utf-8')
  get() {
    return 'User-Agent: *\nDisallow: /\n';
  }
}
