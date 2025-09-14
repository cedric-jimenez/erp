import { CreateQuoteDto } from '../dto/create-quote.dto';
import { Quote, QuoteLine, QuoteStatus, Prisma } from '@prisma/client';

export class QuoteFactory {
  /**
   * Génère un Quote complet pour les tests
   */
  static create(overrides?: Partial<Quote>): Quote {
    const now = new Date();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // 30 jours dans le futur

    const baseQuote: Quote = {
      id: Math.floor(Math.random() * 1000) + 1,
      number: `QUO-${new Date().getFullYear()}-${Math.floor(Math.random() * 999)
        .toString()
        .padStart(3, '0')}`,
      customerId: Math.floor(Math.random() * 100) + 1,
      customerName: 'Client Test SARL',
      customerEmail: 'client@test.fr',
      status: QuoteStatus.DRAFT,
      totalAmount: new Prisma.Decimal(200.0),
      taxAmount: new Prisma.Decimal(40.0),
      totalWithTax: new Prisma.Decimal(240.0),
      validUntil,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      ...overrides,
    };
    return baseQuote;
  }

  /**
   * Génère une QuoteLine pour les tests
   */
  static createLine(overrides?: Partial<QuoteLine>): QuoteLine {
    const baseQuoteLine: QuoteLine = {
      id: Math.floor(Math.random() * 1000) + 1,
      quoteId: 1,
      itemId: 42,
      itemCode: 'ITEM001',
      itemName: 'Article Test',
      quantity: new Prisma.Decimal(2),
      unitPrice: new Prisma.Decimal(100.0),
      lineTotal: new Prisma.Decimal(200.0),
      ...overrides,
    };
    return baseQuoteLine;
  }

  /**
   * Génère un CreateQuoteDto pour les tests
   */
  static createDto(overrides?: Partial<CreateQuoteDto>): CreateQuoteDto {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    return {
      customerId: Math.floor(Math.random() * 100) + 1,
      customerName: 'Client Test SARL',
      customerEmail: 'client@test.fr',
      validUntil: validUntil.toISOString(),
      lines: [
        {
          itemId: 42,
          itemCode: 'ITEM001',
          itemName: 'Article Test',
          quantity: 2,
          unitPrice: 100.0,
        },
      ],
      ...overrides,
    };
  }

  /**
   * Génère plusieurs quotes pour les tests
   */
  static createMany(count: number, overrides?: Partial<Quote>): Quote[] {
    return Array.from({ length: count }, (_, index) =>
      QuoteFactory.create({
        id: index + 1,
        number: `QUO-${new Date().getFullYear()}-${(index + 1)
          .toString()
          .padStart(3, '0')}`,
        customerName: `Client Test ${index + 1}`,
        customerEmail: `client${index + 1}@test.fr`,
        ...overrides,
      }),
    );
  }

  /**
   * Génère un quote avec un statut spécifique
   */
  static createWithStatus(
    status: QuoteStatus,
    overrides?: Partial<Quote>,
  ): Quote {
    return QuoteFactory.create({
      status,
      ...overrides,
    });
  }

  /**
   * Génère un quote expiré
   */
  static createExpired(overrides?: Partial<Quote>): Quote {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 10); // 10 jours dans le passé

    return QuoteFactory.create({
      status: QuoteStatus.EXPIRED,
      validUntil: expiredDate,
      ...overrides,
    });
  }

  /**
   * Génère un quote supprimé (soft delete)
   */
  static createDeleted(overrides?: Partial<Quote>): Quote {
    return QuoteFactory.create({
      deletedAt: new Date(),
      ...overrides,
    });
  }

  /**
   * Génère un quote avec des lignes multiples
   */
  static createWithMultipleLines(
    lineCount: number = 3,
    overrides?: Partial<Quote>,
  ): Quote & { lines: QuoteLine[] } {
    const quote = QuoteFactory.create(overrides);
    const lines = Array.from({ length: lineCount }, (_, index) =>
      QuoteFactory.createLine({
        id: index + 1,
        quoteId: quote.id,
        itemId: 42 + index,
        itemCode: `ITEM${(index + 1).toString().padStart(3, '0')}`,
        itemName: `Article Test ${index + 1}`,
        quantity: new Prisma.Decimal(index + 1),
        unitPrice: new Prisma.Decimal(100.0 + index * 50),
        lineTotal: new Prisma.Decimal((index + 1) * (100.0 + index * 50)),
      }),
    );

    // Recalculer les totaux
    const totalAmount = lines.reduce(
      (sum, line) => sum + Number(line.lineTotal),
      0,
    );
    const taxAmount = totalAmount * 0.2;
    const totalWithTax = totalAmount + taxAmount;

    return {
      ...quote,
      totalAmount: new Prisma.Decimal(totalAmount),
      taxAmount: new Prisma.Decimal(taxAmount),
      totalWithTax: new Prisma.Decimal(totalWithTax),
      lines,
    };
  }

  /**
   * Calcule automatiquement les totaux d'un quote basé sur les lignes
   */
  static calculateTotals(
    lines: Array<{ quantity: number; unitPrice: number }>,
    taxRate: number = 0.2,
  ) {
    const totalAmount = lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0,
    );
    const taxAmount = totalAmount * taxRate;
    const totalWithTax = totalAmount + taxAmount;

    return {
      totalAmount: Number(totalAmount.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      totalWithTax: Number(totalWithTax.toFixed(2)),
    };
  }

  /**
   * Génère des données de test complètes pour différents scénarios
   */
  static createTestScenario(): {
    draftQuotes: Quote[];
    sentQuotes: Quote[];
    acceptedQuotes: Quote[];
    expiredQuotes: Quote[];
    deletedQuotes: Quote[];
  } {
    return {
      draftQuotes: QuoteFactory.createMany(3, { status: QuoteStatus.DRAFT }),
      sentQuotes: QuoteFactory.createMany(2, { status: QuoteStatus.SENT }),
      acceptedQuotes: QuoteFactory.createMany(1, {
        status: QuoteStatus.ACCEPTED,
      }),
      expiredQuotes: [QuoteFactory.createExpired()],
      deletedQuotes: [QuoteFactory.createDeleted()],
    };
  }

  /**
   * Génère un quote valide avec tous les calculs corrects
   */
  static createValidQuote(
    itemsData: Array<{
      itemId: number;
      itemCode: string;
      itemName: string;
      quantity: number;
      unitPrice: number;
    }>,
  ): CreateQuoteDto {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    return {
      customerId: Math.floor(Math.random() * 100) + 1,
      customerName: 'Client Test SARL',
      customerEmail: 'client@test.fr',
      validUntil: validUntil.toISOString(),
      lines: itemsData.map((item) => ({
        itemId: item.itemId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };
  }
}

export class QuotePrismaErrors {
  static readonly uniqueConstraint = new Prisma.PrismaClientKnownRequestError(
    'Unique constraint failed on the constraint: `quotes_number_key`',
    {
      code: 'P2002',
      meta: { target: ['number'] },
      clientVersion: '5.0.0',
    },
  );

  static readonly recordNotFound = new Prisma.PrismaClientKnownRequestError(
    'An operation failed because it depends on one or more records that were required but not found.',
    {
      code: 'P2025',
      meta: { cause: 'Record to update not found.' },
      clientVersion: '5.0.0',
    },
  );

  static readonly foreignKeyConstraint =
    new Prisma.PrismaClientKnownRequestError(
      'Foreign key constraint violated on the constraint: `quote_lines_item_id_fkey`',
      {
        code: 'P2003',
        meta: { constraint: 'quote_lines_item_id_fkey' },
        clientVersion: '5.0.0',
      },
    );
}
