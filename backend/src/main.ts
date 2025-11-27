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
    credentials: false,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  try {
    await app.get(AuthService).createDefaultAdmin();
    console.log('Admin padrão criado/verificado com sucesso');
  } catch (error) {
    console.error('Erro ao criar admin padrão:', error);
  }

  await app.listen(8000, '0.0.0.0');
}
void bootstrap();
