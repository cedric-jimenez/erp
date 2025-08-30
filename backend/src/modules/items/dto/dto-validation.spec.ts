import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateItemDto } from './create-item.dto';
import { UpdateItemDto } from './update-item.dto';
import { QueryItemsDto } from './query-items.dto';

// Helper function to transform and validate DTOs
const transformAndValidate = async <T extends object>(
  dtoClass: new () => T,
  data: unknown,
): Promise<{ dto: T; errors: ValidationError[] }> => {
  const dto = plainToClass(dtoClass, data, { enableImplicitConversion: false });
  const errors = await validate(dto);
  return { dto, errors };
};

describe('DTO Validation', () => {
  describe('CreateItemDto', () => {
    it('should pass validation with valid complete data', async () => {
      // Arrange
      const validData = {
        code: 'USB001',
        name: 'Clé USB 16GB',
        description: 'Description détaillée',
        unit: 'unité',
        category: 'Informatique',
        stockMin: 10,
        active: true,
      };

      // Act
      const { dto, errors } = await transformAndValidate(
        CreateItemDto,
        validData,
      );

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.code).toBe('USB001');
      expect(dto.name).toBe('Clé USB 16GB');
    });

    it('should pass validation with minimal required data', async () => {
      // Arrange
      const minimalData = {
        code: 'MIN001',
        name: 'Article minimal',
      };

      // Act
      const { dto, errors } = await transformAndValidate(
        CreateItemDto,
        minimalData,
      );

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.code).toBe('MIN001');
      expect(dto.name).toBe('Article minimal');
    });

    it('should fail with missing required fields', async () => {
      // Arrange
      const invalidData = {};

      // Act
      const { errors } = await transformAndValidate(CreateItemDto, invalidData);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const errorProperties = errors.map(
        (error: ValidationError) => error.property,
      );
      expect(errorProperties).toContain('code');
      expect(errorProperties).toContain('name');
    });

    it('should fail with invalid field lengths', async () => {
      // Arrange
      const invalidData = {
        code: 'A'.repeat(51), // Too long (max 50)
        name: 'B'.repeat(201), // Too long (max 200)
        unit: 'C'.repeat(21), // Too long (max 20)
        category: 'D'.repeat(101), // Too long (max 100)
      };

      // Act
      const { errors } = await transformAndValidate(CreateItemDto, invalidData);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const errorProperties = errors.map(
        (error: ValidationError) => error.property,
      );
      expect(errorProperties).toContain('code');
      expect(errorProperties).toContain('name');
      expect(errorProperties).toContain('unit');
      expect(errorProperties).toContain('category');
    });

    it('should fail with negative stockMin', async () => {
      // Arrange
      const invalidData = {
        code: 'TEST001',
        name: 'Test Item',
        stockMin: -5,
      };

      // Act
      const { errors } = await transformAndValidate(CreateItemDto, invalidData);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0]?.property).toBe('stockMin');
      expect(errors[0]?.constraints).toHaveProperty('min');
    });

    it('should transform string numbers for stockMin', async () => {
      // Arrange
      const data = {
        code: 'TEST001',
        name: 'Test Item',
        stockMin: '15',
      };

      // Act
      const { dto, errors } = await transformAndValidate(CreateItemDto, data);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.stockMin).toBe(15);
      expect(typeof dto.stockMin).toBe('number');
    });

    it('should trim whitespace from string fields', async () => {
      // Arrange
      const data = {
        code: '  USB001  ',
        name: '  Test Item  ',
        description: '  Description  ',
        unit: '  pièce  ',
        category: '  Informatique  ',
      };

      // Act
      const { dto, errors } = await transformAndValidate(CreateItemDto, data);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.code).toBe('USB001');
      expect(dto.name).toBe('Test Item');
      expect(dto.description).toBe('Description');
      expect(dto.unit).toBe('pièce');
      expect(dto.category).toBe('Informatique');
    });
  });

  describe('UpdateItemDto', () => {
    it('should pass validation with partial data', async () => {
      // Arrange
      const partialData = {
        name: 'Updated Name',
        stockMin: 20,
      };

      // Act
      const { dto, errors } = await transformAndValidate(
        UpdateItemDto,
        partialData,
      );

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.name).toBe('Updated Name');
      expect(dto.stockMin).toBe(20);
    });

    it('should pass validation with empty data', async () => {
      // Arrange
      const emptyData = {};

      // Act
      const { errors } = await transformAndValidate(UpdateItemDto, emptyData);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail with invalid field lengths (same as CreateItemDto)', async () => {
      // Arrange
      const invalidData = {
        code: 'A'.repeat(51),
        name: 'B'.repeat(201),
      };

      // Act
      const { errors } = await transformAndValidate(UpdateItemDto, invalidData);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const errorProperties = errors.map(
        (error: ValidationError) => error.property,
      );
      expect(errorProperties).toContain('code');
      expect(errorProperties).toContain('name');
    });
  });

  describe('QueryItemsDto', () => {
    it('should pass validation with default values', async () => {
      // Arrange
      const data = {};

      // Act
      const { dto, errors } = await transformAndValidate(QueryItemsDto, data);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(20);
      expect(dto.includeArchived).toBe(false);
    });

    it('should pass validation with all valid parameters', async () => {
      // Arrange - using string booleans as expected by transform
      const validData = {
        page: 2,
        limit: 15,
        search: 'USB',
        category: 'Informatique',
        active: 'true',
        includeArchived: 'false',
      };

      // Act
      const { dto, errors } = await transformAndValidate(
        QueryItemsDto,
        validData,
      );

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(15);
      expect(dto.search).toBe('USB');
      expect(dto.category).toBe('Informatique');
      expect(dto.active).toBe(true);
      expect(dto.includeArchived).toBe(false);
    });

    it('should fail with invalid page and limit values', async () => {
      // Arrange
      const invalidData = {
        page: 0, // Invalid: less than 1
        limit: 101, // Invalid: greater than 100
      };

      // Act
      const { errors } = await transformAndValidate(QueryItemsDto, invalidData);

      // Assert
      expect(errors).toHaveLength(2);
      const errorProperties = errors.map(
        (error: ValidationError) => error.property,
      );
      expect(errorProperties).toContain('page');
      expect(errorProperties).toContain('limit');
    });

    it('should convert string boolean values correctly', async () => {
      // Arrange
      const data = {
        active: 'true',
        includeArchived: 'false',
      };

      // Act
      const { dto, errors } = await transformAndValidate(QueryItemsDto, data);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.active).toBe(true);
      expect(dto.includeArchived).toBe(false);
      expect(typeof dto.active).toBe('boolean');
      expect(typeof dto.includeArchived).toBe('boolean');
    });

    it('should handle invalid boolean strings by setting undefined/default', async () => {
      // Arrange
      const data = {
        active: 'maybe',
        includeArchived: 'perhaps',
      };

      // Act
      const { dto, errors } = await transformAndValidate(QueryItemsDto, data);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.active).toBeUndefined();
      expect(dto.includeArchived).toBe(false); // Transform returns false for non-boolean strings
    });

    it('should trim whitespace from string parameters', async () => {
      // Arrange
      const data = {
        search: '  USB keyboard  ',
        category: '  Informatique  ',
      };

      // Act
      const { dto, errors } = await transformAndValidate(QueryItemsDto, data);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.search).toBe('USB keyboard');
      expect(dto.category).toBe('Informatique');
    });

    it('should convert string numbers to integers for page and limit', async () => {
      // Arrange
      const data = {
        page: '3',
        limit: '25',
      };

      // Act
      const { dto, errors } = await transformAndValidate(QueryItemsDto, data);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.page).toBe(3);
      expect(dto.limit).toBe(25);
      expect(typeof dto.page).toBe('number');
      expect(typeof dto.limit).toBe('number');
    });

    it('should handle edge case values correctly', async () => {
      // Arrange
      const edgeCases = {
        page: 1, // Minimum valid
        limit: 100, // Maximum valid
        search: 'a', // Single character
        category: 'A', // Single character
      };

      // Act
      const { dto, errors } = await transformAndValidate(
        QueryItemsDto,
        edgeCases,
      );

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(100);
      expect(dto.search).toBe('a');
      expect(dto.category).toBe('A');
    });

    it('should reject invalid page and limit values', async () => {
      // Arrange
      const invalidData = {
        page: 0, // Should be at least 1
        limit: 0, // Should be at least 1
      };

      // Act
      const { errors } = await transformAndValidate(QueryItemsDto, invalidData);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const errorProperties = errors.map((error) => error.property);
      expect(errorProperties).toContain('page');
      expect(errorProperties).toContain('limit');
    });

    it('should reject page and limit values that are too high', async () => {
      // Arrange
      const invalidData = {
        page: 999999, // Too high
        limit: 1001, // Should be max 1000
      };

      // Act
      const { errors } = await transformAndValidate(QueryItemsDto, invalidData);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const errorProperties = errors.map((error) => error.property);
      expect(errorProperties).toContain('limit');
    });
  });

  describe('Edge Cases and Boundary Values', () => {
    describe('CreateItemDto Edge Cases', () => {
      it('should handle maximum length strings', async () => {
        // Arrange
        const maxData = {
          code: 'A'.repeat(50), // Maximum code length (50)
          name: 'N'.repeat(200), // Maximum name length (200)
          description: 'D'.repeat(500), // Long description
          unit: 'U'.repeat(20), // Maximum unit length (20)
          category: 'C'.repeat(100), // Maximum category length (100)
          stockMin: 999999, // Large stock minimum
          active: true,
        };

        // Act
        const { dto, errors } = await transformAndValidate(
          CreateItemDto,
          maxData,
        );

        // Assert
        expect(errors).toHaveLength(0);
        expect(dto.code).toBe('A'.repeat(50));
        expect(dto.name).toBe('N'.repeat(200));
      });

      it('should reject strings that are too long', async () => {
        // Arrange
        const tooLongData = {
          code: 'A'.repeat(51), // Over maximum (50)
          name: 'N'.repeat(201), // Over maximum (200)
          unit: 'U'.repeat(21), // Over maximum (20)
        };

        // Act
        const { errors } = await transformAndValidate(
          CreateItemDto,
          tooLongData,
        );

        // Assert
        expect(errors.length).toBeGreaterThan(0);
        const errorProperties = errors.map((error) => error.property);
        expect(errorProperties).toContain('code');
        expect(errorProperties).toContain('name');
        expect(errorProperties).toContain('unit');
      });

      it('should handle negative stockMin values', async () => {
        // Arrange
        const negativeData = {
          code: 'NEG001',
          name: 'Negative Stock Test',
          stockMin: -1,
        };

        // Act
        const { errors } = await transformAndValidate(
          CreateItemDto,
          negativeData,
        );

        // Assert
        expect(errors.length).toBeGreaterThan(0);
        const stockMinErrors = errors.filter(
          (error) => error.property === 'stockMin',
        );
        expect(stockMinErrors.length).toBeGreaterThan(0);
      });

      it('should handle special characters in strings', async () => {
        // Arrange
        const specialCharsData = {
          code: 'SPÉC-001_#',
          name: 'Article avec caractères spéciaux éàü',
          description: 'Description with @#$%^&*()_+{}[]|\\:";\'<>?,./',
          category: 'Catégorie-Spéciale',
        };

        // Act
        const { dto, errors } = await transformAndValidate(
          CreateItemDto,
          specialCharsData,
        );

        // Assert
        expect(errors).toHaveLength(0);
        expect(dto.code).toContain('É');
        expect(dto.name).toContain('éàü');
        expect(dto.description).toContain('@#$%');
      });
    });

    describe('UpdateItemDto Edge Cases', () => {
      it('should handle partial updates with null values', async () => {
        // Arrange
        const partialData = {
          description: null,
          category: null,
          stockMin: 0,
        };

        // Act
        const { dto, errors } = await transformAndValidate(
          UpdateItemDto,
          partialData,
        );

        // Assert
        expect(errors).toHaveLength(0);
        expect(dto.description).toBeNull();
        expect(dto.category).toBeNull();
        expect(dto.stockMin).toBe(0);
      });

      it('should handle empty object (no updates)', async () => {
        // Arrange
        const emptyData = {};

        // Act
        const { dto, errors } = await transformAndValidate(
          UpdateItemDto,
          emptyData,
        );

        // Assert
        expect(errors).toHaveLength(0);
        expect(Object.keys(dto)).toHaveLength(0);
      });
    });
  });
});
