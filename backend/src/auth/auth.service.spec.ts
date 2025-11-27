import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('userSignup', () => {
    it('should create a user with role USER and return tokens', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'pass123',
        name: 'Test User',
      };

      const createdUser = {
        id: 1,
        email: dto.email,
        name: dto.name,
        role: 'USER',
        hash: 'hashedPassword',
        hashedRt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(createdUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');
      mockPrismaService.user.update.mockResolvedValue(createdUser);

      const result = await authService.userSignup(dto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: dto.email,
          name: dto.name,
          role: 'USER',
        }),
      });
      expect(result).toEqual({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });
    });
  });

  describe('userLogin', () => {
    it('should return tokens when credentials are valid', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const existingUser = {
        id: 1,
        email: dto.email,
        name: 'Test User',
        role: 'USER',
        hash: hashedPassword,
        hashedRt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');
      mockPrismaService.user.update.mockResolvedValue(existingUser);

      const result = await authService.userLogin(dto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(result).toEqual({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });
    });
  });

  describe('userLogout', () => {
    it('should remove hashedRt from user', async () => {
      const userId = 1;

      mockPrismaService.user.updateMany.mockResolvedValue({ count: 1 });

      await authService.userLogout(userId);

      expect(mockPrismaService.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: userId,
          hashedRt: {
            not: null,
          },
        },
        data: {
          hashedRt: null,
        },
      });
    });
  });
});
