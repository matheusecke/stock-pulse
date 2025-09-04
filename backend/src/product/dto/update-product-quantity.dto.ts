import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateProductQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
