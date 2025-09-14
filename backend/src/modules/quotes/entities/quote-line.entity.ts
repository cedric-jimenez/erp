import { ApiProperty } from '@nestjs/swagger';

export class QuoteLine {
  @ApiProperty({
    example: 1,
    description: 'Identifiant unique de la ligne',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'Identifiant du devis',
  })
  quoteId: number;

  @ApiProperty({
    example: 42,
    description: "Identifiant de l'article",
  })
  itemId: number;

  @ApiProperty({
    example: 'ART-001',
    description: "Code de l'article",
  })
  itemCode: string;

  @ApiProperty({
    example: 'Ordinateur portable',
    description: "Nom de l'article",
  })
  itemName: string;

  @ApiProperty({
    example: 2,
    description: 'Quantité',
    type: 'number',
    format: 'decimal',
  })
  quantity: number;

  @ApiProperty({
    example: 500.0,
    description: 'Prix unitaire',
    type: 'number',
    format: 'decimal',
  })
  unitPrice: number;

  @ApiProperty({
    example: 1000.0,
    description: 'Total de la ligne',
    type: 'number',
    format: 'decimal',
  })
  lineTotal: number;
}
