import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductQuantityDto } from './dto/update-product-quantity.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const newProduct = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
      },
    });

    return newProduct;
  }

  async updateProductQuantity(id: number, dto: UpdateProductQuantityDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (dto.quantity < 0) {
      throw new BadRequestException('Quantidade não pode ser negativa');
    }

    return await this.prisma.product.update({
      where: { id },
      data: { quantity: dto.quantity },
    });
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (dto.price !== undefined && dto.price <= 0) {
      throw new BadRequestException('Preço deve ser maior que zero');
    }

    return await this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async getAllProducts() {
    return await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteProduct(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Produto deletado com sucesso' };
  }
}
