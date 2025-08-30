import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
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
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemsDto } from './dto/query-items.dto';
import { Item } from './entities/item.entity';

@ApiTags('Items')
@Controller('api/v1/items')
@UsePipes(new ValidationPipe({ transform: true }))
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel article' })
  @ApiBody({ type: CreateItemDto })
  @ApiResponse({
    status: 201,
    description: 'Article créé avec succès',
    type: Item,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflit - Code article déjà existant',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les articles avec pagination et filtres',
  })
  @ApiQuery({ type: QueryItemsDto })
  @ApiResponse({
    status: 200,
    description: 'Liste des articles avec pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Item' },
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
  findAll(@Query() queryDto: QueryItemsDto) {
    return this.itemsService.findAll(queryDto);
  }

  @Get('check-code')
  @ApiOperation({ summary: "Vérifier l'unicité d'un code article" })
  @ApiQuery({
    name: 'code',
    description: 'Code article à vérifier',
    example: 'USB001',
  })
  @ApiQuery({
    name: 'excludeId',
    description: 'ID à exclure de la vérification (pour modification)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Résultat de la vérification',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async checkCode(
    @Query('code') code: string,
    @Query('excludeId') excludeId?: string,
  ) {
    const excludeIdNumber = excludeId ? parseInt(excludeId, 10) : undefined;
    const exists = await this.itemsService.checkCodeExists(
      code,
      excludeIdNumber,
    );

    return {
      exists,
      message: exists
        ? `Le code "${code}" est déjà utilisé`
        : `Le code "${code}" est disponible`,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un article par son ID' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Article trouvé',
    type: Item,
  })
  @ApiResponse({
    status: 404,
    description: 'Article non trouvé',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour complètement un article' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    example: 1,
  })
  @ApiBody({ type: CreateItemDto })
  @ApiResponse({
    status: 200,
    description: 'Article mis à jour avec succès',
    type: Item,
  })
  @ApiResponse({
    status: 404,
    description: 'Article non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflit - Code article déjà existant',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour partiellement un article' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    example: 1,
  })
  @ApiBody({ type: UpdateItemDto })
  @ApiResponse({
    status: 200,
    description: 'Article mis à jour avec succès',
    type: Item,
  })
  @ApiResponse({
    status: 404,
    description: 'Article non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflit - Code article déjà existant',
  })
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Archiver un article (suppression logique)' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Article archivé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Article non trouvé',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.itemsService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurer un article archivé' })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Article restauré avec succès',
    type: Item,
  })
  @ApiResponse({
    status: 404,
    description: 'Article non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: "L'article n'est pas archivé",
  })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.restore(id);
  }
}
