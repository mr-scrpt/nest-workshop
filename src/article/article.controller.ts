import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';

@Controller('article')
@ApiTags('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @ApiCreatedResponse({ type: ArticleEntity, isArray: true })
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: ArticleEntity })
  async findOne(@Param('id') id: string) {
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
    @Param('id') id: string,
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
  async remove(@Param('id') id: string) {
    try {
      return await this.articleService.remove(+id);
    } catch (e) {
      throw new NotFoundException('Article not found');
    }
  }
}
