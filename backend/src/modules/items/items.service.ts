import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemsDto } from './dto/query-items.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    try {
      const item = await this.prisma.item.create({
        data: {
          code: createItemDto.code,
          name: createItemDto.name,
          description: createItemDto.description || null,
          unit: createItemDto.unit || 'unité',
          category: createItemDto.category || null,
          stockMin: createItemDto.stockMin || 0,
          active: createItemDto.active ?? true,
        },
      });
      return item;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Un article avec le code "${createItemDto.code}" existe déjà`,
          );
        }
      }
      throw error;
    }
  }

  async findAll(queryDto: QueryItemsDto) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      active,
      includeArchived = false,
    } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.ItemWhereInput = {
      // Filtrage par suppression logique
      deletedAt: includeArchived ? undefined : null,
    };

    // Filtrage par statut actif/archivé
    if (active !== undefined) {
      where.active = active;
    }

    // Recherche par nom ou code
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtrage par catégorie
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { active: 'desc' }, // Articles actifs en premier
          { code: 'asc' },
        ],
      }),
      this.prisma.item.count({ where }),
    ]);

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const item = await this.prisma.item.findFirst({
      where: {
        id,
        deletedAt: null, // Exclure les articles supprimés
      },
    });

    if (!item) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé`);
    }

    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    // Vérifier que l'article existe et n'est pas supprimé
    await this.findOne(id);

    try {
      const item = await this.prisma.item.update({
        where: { id },
        data: {
          ...(updateItemDto.code && { code: updateItemDto.code }),
          ...(updateItemDto.name && { name: updateItemDto.name }),
          ...(updateItemDto.description !== undefined && {
            description: updateItemDto.description || null,
          }),
          ...(updateItemDto.unit && { unit: updateItemDto.unit }),
          ...(updateItemDto.category !== undefined && {
            category: updateItemDto.category || null,
          }),
          ...(updateItemDto.stockMin !== undefined && {
            stockMin: updateItemDto.stockMin,
          }),
          ...(updateItemDto.active !== undefined && {
            active: updateItemDto.active,
          }),
        },
      });
      return item;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Un article avec le code "${updateItemDto.code}" existe déjà`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    // Vérifier que l'article existe et n'est pas déjà supprimé
    await this.findOne(id);

    const item = await this.prisma.item.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        active: false, // Désactiver automatiquement lors de l'archivage
      },
    });

    return item;
  }

  async restore(id: number) {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé`);
    }

    if (!item.deletedAt) {
      throw new ConflictException(
        `L'article avec l'ID ${id} n'est pas archivé`,
      );
    }

    const restoredItem = await this.prisma.item.update({
      where: { id },
      data: {
        deletedAt: null,
        active: true, // Réactiver lors de la restauration
      },
    });

    return restoredItem;
  }

  async checkCodeExists(code: string, excludeId?: number) {
    const where: Prisma.ItemWhereInput = {
      code: { equals: code, mode: 'insensitive' },
      deletedAt: null, // Exclure les articles supprimés
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingItem = await this.prisma.item.findFirst({ where });
    return !!existingItem;
  }
}
