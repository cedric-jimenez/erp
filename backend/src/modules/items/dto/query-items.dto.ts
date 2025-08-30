import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryItemsDto {
  @ApiPropertyOptional({
    description: 'Numéro de page (commence à 1)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? parseInt(value, 10) || 1
      : typeof value === 'number'
        ? value
        : 1,
  )
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Nombre d'éléments par page",
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? parseInt(value, 10) || 20
      : typeof value === 'number'
        ? value
        : 20,
  )
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Recherche par nom ou code (recherche partielle)',
    example: 'USB',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par catégorie exacte',
    example: 'Informatique',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  category?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par statut actif/archivé',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Inclure les articles archivés dans les résultats',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    if (value === undefined || value === null) return false;
    return false;
  })
  includeArchived?: boolean = false;
}
