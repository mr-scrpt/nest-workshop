import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(140)
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(300)
  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(3000)
  body: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  published?: boolean = false;
}
