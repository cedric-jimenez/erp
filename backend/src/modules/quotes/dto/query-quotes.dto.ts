import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { QuoteStatus } from '@prisma/client';

export class QueryQuotesDto {
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
    description: 'Recherche par numéro de devis ou nom de client',
    example: 'QUO-2024',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par statut du devis',
    enum: QuoteStatus,
    example: QuoteStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus;

  @ApiPropertyOptional({
    description: 'Filtrer par nom de client (recherche partielle)',
    example: 'ACME',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Date de début pour filtrer par date de création (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Date de fin pour filtrer par date de création (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  dateTo?: string;
}
