import { IsString, IsNotEmpty, IsArray, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class AnswerDto {
  @ApiProperty({ example: 'Answer text', description: 'Текст ответа' })
  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL изображения для вопроса', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 1, description: 'Порядок вопроса в квизе', required: false })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ type: [AnswerDto], description: 'Список ответов для вопроса' })
  @IsArray()
  answers: AnswerDto[];
}

export class CreateQuizDto {
  @ApiProperty({ example: 'Math Quiz', description: 'Название квиза' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A quiz about basic math', description: 'Описание квиза', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Welcome to the Math Quiz!', description: 'Текст первой страницы', required: false })
  @IsString()
  @IsOptional()
  firstPage?: string;

  @ApiProperty({ example: 'Thank you for completing the quiz!', description: 'Текст финальной страницы', required: false })
  @IsString()
  @IsOptional()
  finalPage?: string;

  @ApiProperty({ example: true, description: 'Активен ли квиз', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 'https://example.com/preview.jpg', description: 'URL изображения для превью квиза', required: false })
  @IsString()
  @IsOptional()
  previewImage?: string;

  @ApiProperty({ example: 1, description: 'ID категории квиза', required: false })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ type: [QuestionDto], description: 'Список вопросов для квиза' })
  @IsArray()
  questions: QuestionDto[];
}