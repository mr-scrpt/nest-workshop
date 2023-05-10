import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  UseFilters,
  HttpException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';
import { PrismaClientExceptionFilter } from '../prisma-client-exception/prisma-client-exception.filter';

@Controller('article')
@ApiTags('article')
@UseFilters(PrismaClientExceptionFilter)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articleService.create(createArticleDto);
    // try {
    //   return await this.articleService.create(createArticleDto);
    // } catch (e) {
    //   throw new HttpException('Article already exists', 409);
    // }
  }

  @Get()
  @ApiCreatedResponse({ type: ArticleEntity, isArray: true })
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: ArticleEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const article = await this.articleService.findOne(+id);
      if (!article) throw new Error();
      return article;
    } catch (e) {
      throw new NotFoundException('Article not found');
    }
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ArticleEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    try {
      return await this.articleService.update(+id, updateArticleDto);
    } catch (e) {
      throw new NotFoundException('Article not found');
    }
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: ArticleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.articleService.remove(+id);
    } catch (e) {
      throw new NotFoundException('Article not found');
    }
  }
}
