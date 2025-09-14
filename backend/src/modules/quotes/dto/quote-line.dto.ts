import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QuoteLineDto {
  @ApiProperty({
    description: "Identifiant de l'article",
    example: 42,
  })
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  itemId: number;

  @ApiProperty({
    description: "Code de l'article (dénormalisé)",
    example: 'ART-001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  itemCode: string;

  @ApiProperty({
    description: "Nom de l'article (dénormalisé)",
    example: 'Ordinateur portable',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  itemName: string;

  @ApiProperty({
    description: 'Quantité',
    example: 2,
    type: 'number',
    format: 'decimal',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity: number;

  @ApiProperty({
    description: 'Prix unitaire',
    example: 500.0,
    type: 'number',
    format: 'decimal',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;
}
