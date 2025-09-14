import { plainToClass } from 'class-transformer';
import { QueryQuotesDto } from './query-quotes.dto';
import { QuoteStatus } from '@prisma/client';

describe('QueryQuotesDto Extended Validation', () => {
  describe('page transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: '3',
      });

      expect(dto.page).toBe(3);
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: 'invalid',
      });

      expect(dto.page).toBe(1);
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: 5,
      });

      expect(dto.page).toBe(5);
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: null,
      });

      expect(dto.page).toBe(1);
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {});

      expect(dto.page).toBe(1);
    });
  });

  describe('limit transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        limit: '50',
      });

      expect(dto.limit).toBe(50);
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        limit: 'invalid',
      });

      expect(dto.limit).toBe(20);
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        limit: 30,
      });

      expect(dto.limit).toBe(30);
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        limit: undefined,
      });

      expect(dto.limit).toBe(20);
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        limit: true,
      });

      expect(dto.limit).toBe(20);
    });
  });

  describe('search transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        search: '  QUO-2024  ',
      });

      expect(dto.search).toBe('QUO-2024');
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        search: 123,
      });

      expect(dto.search).toBeUndefined();
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        search: null,
      });

      expect(dto.search).toBeUndefined();
    });
  });

  describe('customerName transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        customerName: '  ACME Corp  ',
      });

      expect(dto.customerName).toBe('ACME Corp');
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        customerName: false,
      });

      expect(dto.customerName).toBeUndefined();
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        customerName: ['test'],
      });

      expect(dto.customerName).toBeUndefined();
    });
  });

  describe('dateFrom transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        dateFrom: '  2024-01-01  ',
      });

      expect(dto.dateFrom).toBe('2024-01-01');
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        dateFrom: 20240101,
      });

      expect(dto.dateFrom).toBeUndefined();
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        dateFrom: { date: '2024-01-01' },
      });

      expect(dto.dateFrom).toBeUndefined();
    });
  });

  describe('dateTo transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        dateTo: '  2024-12-31  ',
      });

      expect(dto.dateTo).toBe('2024-12-31');
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        dateTo: new Date(),
      });

      expect(dto.dateTo).toBeUndefined();
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        dateTo: '',
      });

      expect(dto.dateTo).toBe('');
    });
  });

  describe('status field', () => {
    it('$1', () => {
      const statuses = [
        QuoteStatus.DRAFT,
        QuoteStatus.SENT,
        QuoteStatus.ACCEPTED,
        QuoteStatus.REJECTED,
        QuoteStatus.EXPIRED,
      ];

      for (const status of statuses) {
        const dto = plainToClass(QueryQuotesDto, { status });
        expect(dto.status).toBe(status);
      }
    });
  });

  describe('all transformations combined', () => {
    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: '2',
        limit: '50',
        search: '  QUO-2024  ',
        status: QuoteStatus.SENT,
        customerName: '  ACME Corporation  ',
        dateFrom: '  2024-01-01  ',
        dateTo: '  2024-12-31  ',
      });

      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(50);
      expect(dto.search).toBe('QUO-2024');
      expect(dto.status).toBe(QuoteStatus.SENT);
      expect(dto.customerName).toBe('ACME Corporation');
      expect(dto.dateFrom).toBe('2024-01-01');
      expect(dto.dateTo).toBe('2024-12-31');
    });

    it('$1', () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: 'invalid',
        limit: null,
        search: 123,
        customerName: false,
        dateFrom: { invalid: true },
        dateTo: [],
      });

      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(20);
      expect(dto.search).toBeUndefined();
      expect(dto.customerName).toBeUndefined();
      expect(dto.dateFrom).toBeUndefined();
      expect(dto.dateTo).toBeUndefined();
    });
  });
});
