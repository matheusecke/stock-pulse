import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // Permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // Desabilita credentials por enquanto
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.get(AuthService).createDefaultAdmin();

  await app.listen(8000, '0.0.0.0');
}
void bootstrap();
