import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsOptional, IsString } from 'class-validator';

export class AnswerDto {
  @ApiProperty({ description: 'ID вопроса', example: 1 })
  @IsNumber()
  questionId: number;

  @ApiProperty({ description: 'ID выбранного ответа', example: 101 })
  @IsNumber()
  answerId: number;
}

export class UserResultDto {
  @ApiProperty({ description: 'ID квиза', example: 21 })
  @IsNumber()
  quizId: number;

  @ApiProperty({ description: 'ID пользователя', required: false, example: 1 })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Уникальный ID сессии', required: false, example: 'session-1234567890' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ description: 'Баллы пользователя', example: 75 })
  @IsNumber()
  score: number;

  @ApiProperty({ description: 'Ответы пользователя', type: [AnswerDto] })
  @IsArray()
  answers: AnswerDto[];
}