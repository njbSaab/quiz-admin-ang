import { IsString, IsOptional, IsArray, ValidateNested, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AnswerDto {
  @ApiProperty({ example: 'Answer text', description: 'Текст ответа' })
  @IsString()
  text: string;

  @ApiProperty({ example: true, description: 'Является ли ответ правильным' })
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty({ example: 1, description: 'Очки за правильный ответ' })
  @IsInt()
  points: number;
}

class QuestionDto {
  @ApiProperty({ example: 'What is 2+2?', description: 'Текст вопроса' })
  @IsString()
  text: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL изображения для вопроса', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 1, description: 'Порядок вопроса в квизе', required: false })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ type: [AnswerDto], description: 'Список ответов для вопроса', required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers?: AnswerDto[];
}

export class UpdateQuizDto {
  @ApiProperty({ example: 'Math Quiz', description: 'Название квиза', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'A quiz about basic math', description: 'Описание квиза', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Welcome to the Math Quiz!', description: 'Текст первой страницы', required: false })
  @IsOptional()
  @IsString()
  firstPage?: string;

  @ApiProperty({ example: 'Thank you for completing the quiz!', description: 'Текст финальной страницы', required: false })
  @IsOptional()
  @IsString()
  finalPage?: string;

  @ApiProperty({ example: true, description: 'Активен ли квиз', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'https://example.com/preview.jpg', description: 'URL изображения для превью квиза', required: false })
  @IsOptional()
  @IsString()
  previewImage?: string;

  @ApiProperty({ example: 1, description: 'ID категории квиза', required: false })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({ type: [QuestionDto], description: 'Список вопросов для квиза', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];
}