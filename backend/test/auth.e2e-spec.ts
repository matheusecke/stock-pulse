import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Se DATABASE_URL não estiver definido (teste local), usa banco de teste
// Se estiver definido (container), usa o banco existente
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'mysql://test:test123@localhost:3306/stockpulse_test';
}
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || 'access-secret';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'refresh-secret';
process.env.DEFAULT_ADMIN_EMAIL =
  process.env.DEFAULT_ADMIN_EMAIL || 'admin@test.com';
process.env.DEFAULT_ADMIN_PASSWORD =
  process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await app.close();
  });

  describe('POST /auth/users/signup', () => {
    it('should create a user and return tokens', async () => {
      const signupDto = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/users/signup')
        .send(signupDto)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      expect(typeof response.body.access_token).toBe('string');
      expect(typeof response.body.refresh_token).toBe('string');

      // Verifica se o usuário foi criado no banco de dados
      const user = await prismaService.user.findUnique({
        where: { email: signupDto.email },
      });
      expect(user).not.toBeNull();
      expect(user?.name).toBe(signupDto.name);
      expect(user?.role).toBe('USER');
    });
  });

  describe('POST /auth/users/login', () => {
    it('should return tokens with valid credentials', async () => {
      // Cria um usuário
      const signupDto = {
        email: 'login@test.com',
        password: 'password123',
        name: 'User',
      };

      await request(app.getHttpServer())
        .post('/auth/users/signup')
        .send(signupDto)
        .expect(201);

      // Faz login
      const loginDto = {
        email: signupDto.email,
        password: signupDto.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/users/login')
        .send(loginDto)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      expect(typeof response.body.access_token).toBe('string');
      expect(typeof response.body.refresh_token).toBe('string');
    });
  });
});
