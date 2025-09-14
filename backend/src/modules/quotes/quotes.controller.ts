import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QueryQuotesDto } from './dto/query-quotes.dto';
import { Quote } from './entities/quote.entity';

@ApiTags('Quotes')
@Controller('api/v1/quotes')
@UsePipes(new ValidationPipe({ transform: true }))
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau devis' })
  @ApiBody({ type: CreateQuoteDto })
  @ApiResponse({
    status: 201,
    description: 'Devis créé avec succès',
    type: Quote,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou articles introuvables',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflit - Numéro de devis déjà existant',
  })
  create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.create(createQuoteDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les devis avec pagination et filtres',
  })
  @ApiQuery({ type: QueryQuotesDto })
  @ApiResponse({
    status: 200,
    description: 'Liste des devis avec pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Quote' },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrevious: { type: 'boolean' },
          },
        },
      },
    },
  })
  findAll(@Query() queryDto: QueryQuotesDto) {
    return this.quotesService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un devis par son ID' })
  @ApiParam({
    name: 'id',
    description: 'ID du devis',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Devis trouvé avec ses lignes',
    type: Quote,
  })
  @ApiResponse({
    status: 404,
    description: 'Devis non trouvé',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quotesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour un devis (uniquement en statut DRAFT)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du devis',
    example: 1,
  })
  @ApiBody({ type: UpdateQuoteDto })
  @ApiResponse({
    status: 200,
    description: 'Devis mis à jour avec succès',
    type: Quote,
  })
  @ApiResponse({
    status: 404,
    description: 'Devis non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Le devis ne peut pas être modifié (pas en brouillon)',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou articles introuvables',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuoteDto: UpdateQuoteDto,
  ) {
    return this.quotesService.update(id, updateQuoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un devis (suppression logique, sauf si accepté)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du devis',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Devis supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Devis non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Un devis accepté ne peut pas être supprimé',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.quotesService.remove(id);
  }

  @Patch(':id/send')
  @ApiOperation({
    summary: 'Envoyer un devis (changer statut DRAFT → SENT)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du devis',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Devis envoyé avec succès',
    type: Quote,
  })
  @ApiResponse({
    status: 404,
    description: 'Devis non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: "Le devis n'est pas en brouillon",
  })
  sendQuote(@Param('id', ParseIntPipe) id: number) {
    return this.quotesService.sendQuote(id);
  }

  @Patch(':id/accept')
  @ApiOperation({
    summary: 'Accepter un devis (changer statut SENT → ACCEPTED)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du devis',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Devis accepté avec succès',
    type: Quote,
  })
  @ApiResponse({
    status: 404,
    description: 'Devis non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: "Le devis n'est pas envoyé",
  })
  acceptQuote(@Param('id', ParseIntPipe) id: number) {
    return this.quotesService.acceptQuote(id);
  }

  @Patch(':id/reject')
  @ApiOperation({
    summary: 'Rejeter un devis (changer statut SENT → REJECTED)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du devis',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Devis rejeté avec succès',
    type: Quote,
  })
  @ApiResponse({
    status: 404,
    description: 'Devis non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: "Le devis n'est pas envoyé",
  })
  rejectQuote(@Param('id', ParseIntPipe) id: number) {
    return this.quotesService.rejectQuote(id);
  }

  @Post('maintenance/mark-expired')
  @ApiOperation({
    summary: 'Marquer les devis expirés (tâche de maintenance)',
  })
  @ApiResponse({
    status: 200,
    description: 'Devis expirés marqués',
    schema: {
      type: 'object',
      properties: {
        updatedCount: {
          type: 'number',
          description: 'Nombre de devis marqués comme expirés',
        },
      },
    },
  })
  markExpiredQuotes() {
    return this.quotesService.markExpiredQuotes();
  }
}
