import { ApiProperty } from '@nestjs/swagger';

export class Item {
  @ApiProperty({
    description: "ID unique de l'article",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Code unique de l'article",
    example: 'USB001',
    maxLength: 50,
  })
  code: string;

  @ApiProperty({
    description: "Nom de l'article",
    example: 'Clé USB 16GB',
    maxLength: 200,
  })
  name: string;

  @ApiProperty({
    description: "Description détaillée de l'article",
    example: 'Clé USB 16GB haute vitesse USB 3.0',
    required: false,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Unité de mesure',
    example: 'unité',
    default: 'unité',
    maxLength: 20,
  })
  unit: string;

  @ApiProperty({
    description: "Catégorie de l'article",
    example: 'Informatique',
    required: false,
    maxLength: 100,
  })
  category?: string | null;

  @ApiProperty({
    description: 'Stock minimum requis',
    example: 10,
    default: 0,
  })
  stockMin: number;

  @ApiProperty({
    description: 'Article actif ou archivé',
    example: true,
    default: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-08-24T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière modification',
    example: '2024-08-24T10:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Date de suppression (soft delete)',
    example: null,
    required: false,
  })
  deletedAt?: Date | null;
}
