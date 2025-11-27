import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductService', () => {
  let productService: ProductService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);

    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product with correct data', async () => {
      const dto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        quantity: 10,
      };

      const createdProduct = {
        id: 1,
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.create.mockResolvedValue(createdProduct);

      const result = await productService.createProduct(dto);

      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          quantity: dto.quantity,
        },
      });
      expect(result).toEqual(createdProduct);
    });
  });

  describe('getAllProducts', () => {
    it('should return a list of products ordered by date', async () => {
      const products = [
        {
          id: 2,
          name: 'Product 2',
          description: 'Description',
          price: 200,
          quantity: 20,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date(),
        },
        {
          id: 1,
          name: 'Product 1',
          description: 'Description',
          price: 100,
          quantity: 10,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(products);

      const result = await productService.getAllProducts();

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(products);
    });
  });

  describe('updateProductQuantity', () => {
    it('should update quantity successfully', async () => {
      const productId = 1;
      const dto = { quantity: 50 };

      const existingProduct = {
        id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProduct = { ...existingProduct, quantity: dto.quantity };

      mockPrismaService.product.findUnique.mockResolvedValue(existingProduct);
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await productService.updateProductQuantity(productId, dto);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: { quantity: dto.quantity },
      });
      expect(result.quantity).toBe(50);
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const productId = 1;
      const dto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 149.99,
      };

      const existingProduct = {
        id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProduct = { ...existingProduct, ...dto };

      mockPrismaService.product.findUnique.mockResolvedValue(existingProduct);
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await productService.updateProduct(productId, dto);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: dto,
      });
      expect(result.name).toBe(dto.name);
      expect(result.description).toBe(dto.description);
      expect(result.price).toBe(dto.price);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product and return success message', async () => {
      const productId = 1;

      const existingProduct = {
        id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.findUnique.mockResolvedValue(existingProduct);
      mockPrismaService.product.delete.mockResolvedValue(existingProduct);

      const result = await productService.deleteProduct(productId);

      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result).toEqual({ message: 'Produto deletado com sucesso' });
    });
  });
});
