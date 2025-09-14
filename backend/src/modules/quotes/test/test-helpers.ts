import { Quote, QuoteLine, QuoteStatus, Prisma, Item } from '@prisma/client';
import { QuoteFactory, QuotePrismaErrors } from './quote.factory';

// Types for mock data
interface MockQuoteLineData {
  itemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface MockQuoteWithLines extends Quote {
  lines?: QuoteLine[];
}
import { ItemFactory } from '../../items/test/item.factory';

/**
 * Type definition for mock Prisma service used in tests
 */
export interface MockPrismaService {
  quote: {
    create: jest.MockedFunction<
      (args: Prisma.QuoteCreateArgs) => Promise<Quote>
    >;
    findMany: jest.MockedFunction<
      (args?: Prisma.QuoteFindManyArgs) => Promise<Quote[]>
    >;
    findFirst: jest.MockedFunction<
      (args?: Prisma.QuoteFindFirstArgs) => Promise<Quote | null>
    >;
    update: jest.MockedFunction<
      (args: Prisma.QuoteUpdateArgs) => Promise<Quote>
    >;
    updateMany: jest.MockedFunction<
      (args: Prisma.QuoteUpdateManyArgs) => Promise<{ count: number }>
    >;
    count: jest.MockedFunction<
      (args?: Prisma.QuoteCountArgs) => Promise<number>
    >;
  };
  item: {
    findMany: jest.MockedFunction<
      (args?: Prisma.ItemFindManyArgs) => Promise<Item[]>
    >;
  };
  $connect: jest.MockedFunction<() => Promise<void>>;
  $disconnect: jest.MockedFunction<() => Promise<void>>;
}

/**
 * Crée un mock complet du PrismaService pour les tests de quotes
 */
export const createMockPrismaService = (): MockPrismaService => {
  const mockPrisma = {
    quote: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    item: {
      findMany: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  return mockPrisma as MockPrismaService;
};

/**
 * Configure les réponses du mock Prisma pour les scénarios de succès
 */
export const setupMockPrismaSuccess = (
  mockPrisma: MockPrismaService,
): { testQuotes: Quote[]; testItems: Item[] } => {
  const testQuotes = QuoteFactory.createMany(3);
  // Create items with IDs that match the quote factory (42, 43, etc.)
  const testItems = [
    ItemFactory.create({ id: 42, code: 'ITEM042', name: 'Test Item 42' }),
    ItemFactory.create({ id: 43, code: 'ITEM043', name: 'Test Item 43' }),
    ItemFactory.create({ id: 44, code: 'ITEM044', name: 'Test Item 44' }),
    ItemFactory.create({ id: 45, code: 'ITEM045', name: 'Test Item 45' }),
    ItemFactory.create({ id: 46, code: 'ITEM046', name: 'Test Item 46' }),
  ];

  // Mock create - retourne un nouveau quote avec ses lignes
  mockPrisma.quote.create.mockImplementation((args: Prisma.QuoteCreateArgs) => {
    const data = args.data;
    const include = args.include;

    const newQuote: Quote = QuoteFactory.create({
      number: data.number,
      customerId: data.customerId as number | null,
      customerName: data.customerName,
      customerEmail: data.customerEmail as string | null,
      status: data.status as QuoteStatus,
      totalAmount: new Prisma.Decimal(data.totalAmount as number),
      taxAmount: new Prisma.Decimal(data.taxAmount as number),
      totalWithTax: new Prisma.Decimal(data.totalWithTax as number),
      validUntil: new Date(data.validUntil),
      id: Math.floor(Math.random() * 1000) + 100,
    });

    if (include?.lines && data.lines && 'create' in data.lines) {
      const linesData = data.lines.create as MockQuoteLineData[];
      const lines = linesData.map(
        (lineData: MockQuoteLineData, index: number) =>
          QuoteFactory.createLine({
            id: index + 1,
            quoteId: newQuote.id,
            itemId: lineData.itemId,
            itemCode: lineData.itemCode,
            itemName: lineData.itemName,
            quantity: new Prisma.Decimal(lineData.quantity),
            unitPrice: new Prisma.Decimal(lineData.unitPrice),
            lineTotal: new Prisma.Decimal(lineData.lineTotal),
          }),
      );
      return Promise.resolve({ ...newQuote, lines } as MockQuoteWithLines);
    }

    return Promise.resolve(newQuote);
  });

  // Mock findMany - retourne liste paginée
  mockPrisma.quote.findMany.mockResolvedValue(testQuotes);
  mockPrisma.quote.count.mockResolvedValue(testQuotes.length);

  // Mock findFirst - retourne un quote ou null
  mockPrisma.quote.findFirst.mockImplementation(
    (args?: Prisma.QuoteFindFirstArgs) => {
      const where = args?.where;
      if (where?.id === 999) return Promise.resolve(null);
      if (where?.id === 1) {
        const quote = testQuotes[0];
        if (args?.include?.lines) {
          const lines = [QuoteFactory.createLine({ quoteId: quote.id })];
          return Promise.resolve({ ...quote, lines } as MockQuoteWithLines);
        }
        return Promise.resolve(quote);
      }
      return Promise.resolve(testQuotes[0]);
    },
  );

  // Mock update - retourne le quote modifié
  mockPrisma.quote.update.mockImplementation((args: Prisma.QuoteUpdateArgs) => {
    const data = args.data;
    const include = args.include;

    const updatedQuote: Quote = {
      ...testQuotes[0],
      ...(data.status !== undefined && { status: data.status as QuoteStatus }),
      ...(data.customerName !== undefined && {
        customerName: data.customerName as string,
      }),
      ...(data.totalAmount !== undefined && {
        totalAmount: new Prisma.Decimal(data.totalAmount as number),
      }),
      ...(data.deletedAt !== undefined && {
        deletedAt: data.deletedAt
          ? new Date(data.deletedAt as string | number | Date)
          : null,
      }),
      updatedAt: new Date(),
    };

    if (include?.lines) {
      const lines = [QuoteFactory.createLine({ quoteId: updatedQuote.id })];
      return Promise.resolve({ ...updatedQuote, lines } as MockQuoteWithLines);
    }

    return Promise.resolve(updatedQuote);
  });

  // Mock updateMany - pour marquer les quotes expirés
  mockPrisma.quote.updateMany.mockResolvedValue({ count: 2 });

  // Mock item.findMany - pour valider les articles
  mockPrisma.item.findMany.mockImplementation((args) => {
    const where = args?.where;
    if (where?.id && typeof where.id === 'object' && 'in' in where.id) {
      const requestedIds = where.id.in as number[];
      const foundItems = testItems.filter((item) =>
        requestedIds.includes(item.id),
      );
      return Promise.resolve(foundItems);
    }
    return Promise.resolve(testItems);
  });

  return { testQuotes, testItems };
};

/**
 * Configure les réponses du mock Prisma pour les scénarios d'erreur
 */
export const setupMockPrismaErrors = (mockPrisma: MockPrismaService): void => {
  // Mock create - erreur de conflit (numéro dupliqué)
  mockPrisma.quote.create.mockRejectedValue(QuotePrismaErrors.uniqueConstraint);

  // Mock findFirst - aucun résultat
  mockPrisma.quote.findFirst.mockResolvedValue(null);

  // Mock update - quote non trouvé
  mockPrisma.quote.update.mockRejectedValue(QuotePrismaErrors.recordNotFound);

  // Mock item.findMany - articles non trouvés
  mockPrisma.item.findMany.mockResolvedValue([]);
};

/**
 * Fonction d'aide pour tester la structure d'un Quote
 */
export const expectQuoteStructure = (quote: unknown): void => {
  expect(quote).toEqual(expect.any(Object));
  const quoteObj = quote as Record<string, unknown>;

  expect(quoteObj).toHaveProperty('id');
  expect(typeof quoteObj.id).toBe('number');

  expect(quoteObj).toHaveProperty('number');
  expect(typeof quoteObj.number).toBe('string');

  expect(quoteObj).toHaveProperty('customerName');
  expect(typeof quoteObj.customerName).toBe('string');

  expect(quoteObj).toHaveProperty('status');
  expect(Object.values(QuoteStatus)).toContain(quoteObj.status);

  expect(quoteObj).toHaveProperty('totalAmount');
  expect(
    typeof quoteObj.totalAmount === 'number' ||
      quoteObj.totalAmount instanceof Prisma.Decimal,
  ).toBe(true);

  expect(quoteObj).toHaveProperty('taxAmount');
  expect(
    typeof quoteObj.taxAmount === 'number' ||
      quoteObj.taxAmount instanceof Prisma.Decimal,
  ).toBe(true);

  expect(quoteObj).toHaveProperty('totalWithTax');
  expect(
    typeof quoteObj.totalWithTax === 'number' ||
      quoteObj.totalWithTax instanceof Prisma.Decimal,
  ).toBe(true);

  expect(quoteObj).toHaveProperty('validUntil');
  expect(quoteObj.validUntil).toBeInstanceOf(Date);

  expect(quoteObj).toHaveProperty('createdAt');
  expect(quoteObj.createdAt).toBeInstanceOf(Date);

  expect(quoteObj).toHaveProperty('updatedAt');
  expect(quoteObj.updatedAt).toBeInstanceOf(Date);
};

/**
 * Fonction d'aide pour tester la structure d'une QuoteLine
 */
export const expectQuoteLineStructure = (line: unknown): void => {
  expect(line).toEqual(expect.any(Object));
  const lineObj = line as Record<string, unknown>;

  expect(lineObj).toHaveProperty('id');
  expect(typeof lineObj.id).toBe('number');

  expect(lineObj).toHaveProperty('quoteId');
  expect(typeof lineObj.quoteId).toBe('number');

  expect(lineObj).toHaveProperty('itemId');
  expect(typeof lineObj.itemId).toBe('number');

  expect(lineObj).toHaveProperty('itemCode');
  expect(typeof lineObj.itemCode).toBe('string');

  expect(lineObj).toHaveProperty('itemName');
  expect(typeof lineObj.itemName).toBe('string');

  expect(lineObj).toHaveProperty('quantity');
  expect(
    typeof lineObj.quantity === 'number' ||
      lineObj.quantity instanceof Prisma.Decimal,
  ).toBe(true);

  expect(lineObj).toHaveProperty('unitPrice');
  expect(
    typeof lineObj.unitPrice === 'number' ||
      lineObj.unitPrice instanceof Prisma.Decimal,
  ).toBe(true);

  expect(lineObj).toHaveProperty('lineTotal');
  expect(
    typeof lineObj.lineTotal === 'number' ||
      lineObj.lineTotal instanceof Prisma.Decimal,
  ).toBe(true);
};

/**
 * Fonction d'aide pour tester la structure de pagination
 */
export const expectPaginationStructure = (result: unknown): void => {
  expect(result).toEqual(expect.any(Object));
  const resultObj = result as Record<string, unknown>;

  expect(resultObj).toHaveProperty('data');
  expect(Array.isArray(resultObj.data)).toBe(true);

  expect(resultObj).toHaveProperty('pagination');
  const pagination = resultObj.pagination as Record<string, unknown>;

  expect(pagination).toHaveProperty('page');
  expect(typeof pagination.page).toBe('number');

  expect(pagination).toHaveProperty('limit');
  expect(typeof pagination.limit).toBe('number');

  expect(pagination).toHaveProperty('total');
  expect(typeof pagination.total).toBe('number');

  expect(pagination).toHaveProperty('totalPages');
  expect(typeof pagination.totalPages).toBe('number');

  expect(pagination).toHaveProperty('hasNext');
  expect(typeof pagination.hasNext).toBe('boolean');

  expect(pagination).toHaveProperty('hasPrevious');
  expect(typeof pagination.hasPrevious).toBe('boolean');
};

/**
 * Helper pour créer des conditions de test standardisées
 */
export const createTestConditions = () => {
  return {
    validId: 1,
    invalidId: 999,
    duplicateNumber: 'QUO-2024-001',
    validItems: [42, 43, 44],
    invalidItems: [999],
    testQuoteData: {
      customerId: 123,
      customerName: 'Test Client SARL',
      customerEmail: 'test@client.com',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      lines: [
        {
          itemId: 42,
          itemCode: 'TEST001',
          itemName: 'Article Test 1',
          quantity: 2,
          unitPrice: 100,
        },
        {
          itemId: 43,
          itemCode: 'TEST002',
          itemName: 'Article Test 2',
          quantity: 1,
          unitPrice: 200,
        },
      ],
    },
    statusTransitions: {
      validDraftToSent: { from: QuoteStatus.DRAFT, to: QuoteStatus.SENT },
      validSentToAccepted: { from: QuoteStatus.SENT, to: QuoteStatus.ACCEPTED },
      validSentToRejected: { from: QuoteStatus.SENT, to: QuoteStatus.REJECTED },
      invalidAcceptedToSent: {
        from: QuoteStatus.ACCEPTED,
        to: QuoteStatus.SENT,
      },
    },
  };
};

/**
 * Helper pour calculer les totaux attendus
 */
export const calculateExpectedTotals = (
  lines: Array<{ quantity: number; unitPrice: number }>,
  taxRate: number = 0.2,
) => {
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
};

/**
 * Helper pour générer un numéro de quote valide
 */
export const generateValidQuoteNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999) + 1;
  return `QUO-${year}-${random.toString().padStart(3, '0')}`;
};
