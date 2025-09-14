import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEmail,
  MaxLength,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { QuoteLineDto } from './quote-line.dto';

export class CreateQuoteDto {
  @ApiProperty({
    description: 'Identifiant du client',
    example: 123,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? parseInt(value, 10) || null : value,
  )
  customerId?: number;

  @ApiProperty({
    description: 'Nom du client',
    example: 'ACME Corporation',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  customerName: string;

  @ApiProperty({
    description: 'Email du client',
    example: 'contact@acme.com',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || null : null,
  )
  customerEmail?: string;

  @ApiProperty({
    description: 'Date de validité du devis',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  validUntil: string;

  @ApiProperty({
    description: 'Lignes du devis',
    type: [QuoteLineDto],
    example: [
      {
        itemId: 42,
        itemCode: 'ART-001',
        itemName: 'Ordinateur portable',
        quantity: 2,
        unitPrice: 500.0,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Un devis doit contenir au moins une ligne' })
  @ValidateNested({ each: true })
  @Type(() => QuoteLineDto)
  lines: QuoteLineDto[];
}
