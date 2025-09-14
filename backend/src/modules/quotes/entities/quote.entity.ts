import { ApiProperty } from '@nestjs/swagger';
import { QuoteStatus } from '@prisma/client';

export class Quote {
  @ApiProperty({
    example: 1,
    description: 'Identifiant unique du devis',
  })
  id: number;

  @ApiProperty({
    example: 'QUO-2024-001',
    description: 'Numéro du devis',
  })
  number: string;

  @ApiProperty({
    example: 123,
    description: 'Identifiant du client',
    required: false,
  })
  customerId?: number;

  @ApiProperty({
    example: 'ACME Corporation',
    description: 'Nom du client',
  })
  customerName: string;

  @ApiProperty({
    example: 'contact@acme.com',
    description: 'Email du client',
    required: false,
  })
  customerEmail?: string;

  @ApiProperty({
    enum: QuoteStatus,
    example: QuoteStatus.DRAFT,
    description: 'Statut du devis',
  })
  status: QuoteStatus;

  @ApiProperty({
    example: 1000.0,
    description: 'Montant total HT',
    type: 'number',
    format: 'decimal',
  })
  totalAmount: number;

  @ApiProperty({
    example: 200.0,
    description: 'Montant de la TVA',
    type: 'number',
    format: 'decimal',
  })
  taxAmount: number;

  @ApiProperty({
    example: 1200.0,
    description: 'Montant total TTC',
    type: 'number',
    format: 'decimal',
  })
  totalWithTax: number;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'Date de validité du devis',
  })
  validUntil: Date;

  @ApiProperty({
    example: '2024-08-15T10:30:00.000Z',
    description: 'Date de création',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-08-15T14:20:00.000Z',
    description: 'Date de dernière modification',
  })
  updatedAt: Date;

  @ApiProperty({
    example: null,
    description: 'Date de suppression (soft delete)',
    required: false,
  })
  deletedAt?: Date;
}
