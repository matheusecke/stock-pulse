import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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

describe('ProductController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let adminToken: string;

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
    await prismaService.product.deleteMany();
    await prismaService.user.deleteMany();

    // Cria usuário admin para teste
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prismaService.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin User',
        hash: hashedPassword,
        role: 'ADMIN',
      },
    });

    // Faz login como admin para obter token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/users/login')
      .send({
        email: 'admin@test.com',
        password: 'admin123',
      })
      .expect(201);

    adminToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await prismaService.product.deleteMany();
    await prismaService.user.deleteMany();
    await app.close();
  });

  describe('POST /products/create', () => {
    it('should allow admin to create a product', async () => {
      const createProductDto = {
        name: 'Product',
        description: 'Description',
        price: 10,
        quantity: 100,
      };

      const response = await request(app.getHttpServer())
        .post('/products/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createProductDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createProductDto.name);
      expect(response.body.description).toBe(createProductDto.description);
      expect(response.body.price).toBe(createProductDto.price);
      expect(response.body.quantity).toBe(createProductDto.quantity);

      // Verifica se o produto foi criado no banco de dados
      const product = await prismaService.product.findFirst({
        where: { name: createProductDto.name },
      });
      expect(product).not.toBeNull();
      expect(product?.price).toBe(createProductDto.price);
    });
  });
});
