import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsOptional, IsString } from 'class-validator';

export class AnswerDto {
  @ApiProperty({ description: 'ID вопроса' })
  @IsNumber()
  questionId: number;

  @ApiProperty({ description: 'ID выбранного ответа' })
  @IsNumber()
  answerId: number;
}

export class UserResultDto {
  @ApiProperty({ description: 'ID квиза' })
  @IsNumber()
  quizId: number;

  @ApiProperty({ description: 'ID пользователя (UUID)', required: false, example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Уникальный ID сессии', required: false })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ description: 'Баллы пользователя' })
  @IsNumber()
  score: number;

  @ApiProperty({ description: 'Ответы пользователя' })
  @IsArray()
  answers: AnswerDto[];
}