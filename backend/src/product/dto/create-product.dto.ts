import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'Preço deve ser maior que zero' })
  @Max(999999.99, { message: 'Preço muito alto' })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
