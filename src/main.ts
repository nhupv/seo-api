import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { RolesGuard } from './guard/roles.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import * as helmet from 'helmet';
import { useContainer } from 'class-validator';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: true,
      // forbidNonWhitelisted: true,
      validationError: {
        target: false,
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(4000);
}
bootstrap();
