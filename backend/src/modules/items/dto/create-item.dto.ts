import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateItemDto {
  @ApiProperty({
    description: "Code unique de l'article",
    example: 'USB001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  code: string;

  @ApiProperty({
    description: "Nom de l'article",
    example: 'Clé USB 16GB',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name: string;

  @ApiProperty({
    description: "Description détaillée de l'article",
    example: 'Clé USB 16GB haute vitesse USB 3.0',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || null : null,
  )
  description?: string;

  @ApiProperty({
    description: 'Unité de mesure',
    example: 'unité',
    default: 'unité',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || 'unité' : 'unité',
  )
  unit?: string;

  @ApiProperty({
    description: "Catégorie de l'article",
    example: 'Informatique',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || null : null,
  )
  category?: string;

  @ApiProperty({
    description: 'Stock minimum requis',
    example: 10,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? parseInt(value, 10) || 0
      : typeof value === 'number'
        ? value
        : 0,
  )
  stockMin?: number;

  @ApiProperty({
    description: 'Article actif ou archivé',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
