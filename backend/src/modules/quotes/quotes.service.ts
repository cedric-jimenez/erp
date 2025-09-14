import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QueryQuotesDto } from './dto/query-quotes.dto';
import { Prisma, QuoteStatus } from '@prisma/client';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Génère un numéro de devis unique au format QUO-YYYY-NNN
   */
  private async generateQuoteNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `QUO-${currentYear}-`;

    // Chercher le dernier numéro de l'année courante
    const lastQuote = await this.prisma.quote.findFirst({
      where: {
        number: {
          startsWith: prefix,
        },
      },
      orderBy: {
        number: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastQuote) {
      // Extraire le numéro séquentiel du dernier devis
      const lastNumber = lastQuote.number.split('-')[2];
      nextNumber = parseInt(lastNumber, 10) + 1;
    }

    // Format avec padding de 3 chiffres
    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }

  /**
   * Calcule les totaux d'un devis à partir de ses lignes
   */
  private calculateTotals(
    lines: { quantity: number; unitPrice: number }[],
    taxRate = 0.2,
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

  async create(createQuoteDto: CreateQuoteDto) {
    // Valider que les articles existent
    const itemIds = createQuoteDto.lines.map((line) => line.itemId);
    const existingItems = await this.prisma.item.findMany({
      where: {
        id: { in: itemIds },
        deletedAt: null,
        active: true,
      },
    });

    if (existingItems.length !== itemIds.length) {
      const missingItemIds = itemIds.filter(
        (id) => !existingItems.find((item) => item.id === id),
      );
      throw new BadRequestException(
        `Articles introuvables ou inactifs: ${missingItemIds.join(', ')}`,
      );
    }

    // Générer le numéro de devis
    const number = await this.generateQuoteNumber();

    // Calculer les totaux
    const { totalAmount, taxAmount, totalWithTax } = this.calculateTotals(
      createQuoteDto.lines,
    );

    try {
      const quote = await this.prisma.quote.create({
        data: {
          number,
          customerId: createQuoteDto.customerId || null,
          customerName: createQuoteDto.customerName,
          customerEmail: createQuoteDto.customerEmail || null,
          status: QuoteStatus.DRAFT,
          totalAmount,
          taxAmount,
          totalWithTax,
          validUntil: new Date(createQuoteDto.validUntil),
          lines: {
            create: createQuoteDto.lines.map((line) => ({
              itemId: line.itemId,
              itemCode: line.itemCode,
              itemName: line.itemName,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              lineTotal: Number((line.quantity * line.unitPrice).toFixed(2)),
            })),
          },
        },
        include: {
          lines: true,
        },
      });

      return quote;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Un devis avec le numéro "${number}" existe déjà`,
          );
        }
      }
      throw error;
    }
  }

  async findAll(queryDto: QueryQuotesDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      customerName,
      dateFrom,
      dateTo,
    } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.QuoteWhereInput = {
      deletedAt: null, // Exclure les devis supprimés
    };

    // Filtrage par statut
    if (status) {
      where.status = status;
    }

    // Recherche par numéro de devis ou nom de client
    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtrage par nom de client
    if (customerName) {
      where.customerName = { contains: customerName, mode: 'insensitive' };
    }

    // Filtrage par dates
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999); // Fin de journée
        where.createdAt.lte = endDate;
      }
    }

    const [quotes, total] = await Promise.all([
      this.prisma.quote.findMany({
        where,
        skip,
        take: limit,
        include: {
          lines: true,
        },
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.quote.count({ where }),
    ]);

    return {
      data: quotes,
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
    const quote = await this.prisma.quote.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        lines: true,
      },
    });

    if (!quote) {
      throw new NotFoundException(`Devis avec l'ID ${id} non trouvé`);
    }

    return quote;
  }

  async update(id: number, updateQuoteDto: UpdateQuoteDto) {
    // Vérifier que le devis existe et peut être modifié
    const existingQuote = await this.findOne(id);

    if (existingQuote.status !== QuoteStatus.DRAFT) {
      throw new ConflictException(
        'Seuls les devis en brouillon peuvent être modifiés',
      );
    }

    // Si des lignes sont fournies, valider les articles
    if (updateQuoteDto.lines) {
      const itemIds = updateQuoteDto.lines.map((line) => line.itemId);
      const existingItems = await this.prisma.item.findMany({
        where: {
          id: { in: itemIds },
          deletedAt: null,
          active: true,
        },
      });

      if (existingItems.length !== itemIds.length) {
        const missingItemIds = itemIds.filter(
          (id) => !existingItems.find((item) => item.id === id),
        );
        throw new BadRequestException(
          `Articles introuvables ou inactifs: ${missingItemIds.join(', ')}`,
        );
      }
    }

    // Calculer les nouveaux totaux si les lignes sont mises à jour
    let totals = {};
    if (updateQuoteDto.lines) {
      totals = this.calculateTotals(updateQuoteDto.lines);
    }

    try {
      const quote = await this.prisma.quote.update({
        where: { id },
        data: {
          ...(updateQuoteDto.customerId !== undefined && {
            customerId: updateQuoteDto.customerId,
          }),
          ...(updateQuoteDto.customerName && {
            customerName: updateQuoteDto.customerName,
          }),
          ...(updateQuoteDto.customerEmail !== undefined && {
            customerEmail: updateQuoteDto.customerEmail,
          }),
          ...(updateQuoteDto.validUntil && {
            validUntil: new Date(updateQuoteDto.validUntil),
          }),
          ...totals,
          ...(updateQuoteDto.lines && {
            lines: {
              deleteMany: {}, // Supprimer toutes les lignes existantes
              create: updateQuoteDto.lines.map((line) => ({
                itemId: line.itemId,
                itemCode: line.itemCode,
                itemName: line.itemName,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                lineTotal: Number((line.quantity * line.unitPrice).toFixed(2)),
              })),
            },
          }),
        },
        include: {
          lines: true,
        },
      });

      return quote;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Conflit lors de la mise à jour du devis',
          );
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    const quote = await this.findOne(id);

    if (quote.status === QuoteStatus.ACCEPTED) {
      throw new ConflictException('Un devis accepté ne peut pas être supprimé');
    }

    const deletedQuote = await this.prisma.quote.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return deletedQuote;
  }

  /**
   * Envoyer un devis (changer le statut vers SENT)
   */
  async sendQuote(id: number) {
    const quote = await this.findOne(id);

    if (quote.status !== QuoteStatus.DRAFT) {
      throw new ConflictException(
        'Seuls les devis en brouillon peuvent être envoyés',
      );
    }

    return this.prisma.quote.update({
      where: { id },
      data: { status: QuoteStatus.SENT },
      include: { lines: true },
    });
  }

  /**
   * Accepter un devis (changer le statut vers ACCEPTED)
   */
  async acceptQuote(id: number) {
    const quote = await this.findOne(id);

    if (quote.status !== QuoteStatus.SENT) {
      throw new ConflictException(
        'Seuls les devis envoyés peuvent être acceptés',
      );
    }

    return this.prisma.quote.update({
      where: { id },
      data: { status: QuoteStatus.ACCEPTED },
      include: { lines: true },
    });
  }

  /**
   * Rejeter un devis (changer le statut vers REJECTED)
   */
  async rejectQuote(id: number) {
    const quote = await this.findOne(id);

    if (quote.status !== QuoteStatus.SENT) {
      throw new ConflictException(
        'Seuls les devis envoyés peuvent être rejetés',
      );
    }

    return this.prisma.quote.update({
      where: { id },
      data: { status: QuoteStatus.REJECTED },
      include: { lines: true },
    });
  }

  /**
   * Marquer les devis expirés
   */
  async markExpiredQuotes() {
    const now = new Date();

    const result = await this.prisma.quote.updateMany({
      where: {
        status: QuoteStatus.SENT,
        validUntil: {
          lt: now,
        },
        deletedAt: null,
      },
      data: {
        status: QuoteStatus.EXPIRED,
      },
    });

    return { updatedCount: result.count };
  }
}
