import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class BrowserInfoDto {
  @ApiProperty({ description: 'User agent браузера' })
  @IsString()
  userAgent: string;

  @ApiProperty({ description: 'Язык браузера' })
  @IsString()
  language: string;

  @ApiProperty({ description: 'Размеры экрана' })
  @IsObject()
  screen: { width: number; height: number };

  @ApiProperty({ description: 'Часовой пояс' })
  @IsString()
  timezone: string;

  @ApiProperty({ description: 'Включены ли cookies' })
  @IsBoolean()
  cookiesEnabled: boolean;

  @ApiProperty({ description: 'Платформа' })
  @IsString()
  platform: string;

  @ApiProperty({ description: 'Реферер' })
  @IsString()
  referrer: string;

  @ApiProperty({ description: 'IP-адрес', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ description: 'Геолокация', required: false })
  @IsOptional()
  geolocation?: { latitude: number; longitude: number };
}

export class UserSessionDataDto {
  @ApiProperty({ description: 'ID квиза', required: false })
  @IsOptional()
  @IsNumber()
  quizId?: number;

  @ApiProperty({ description: 'ID пользователя (UUID)', required: false, example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsString() // Изменено с IsNumber на IsString
  userId?: string;

  @ApiProperty({ description: 'Уникальный ID сессии', required: false })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ description: 'Индекс текущего вопроса' })
  @IsNumber()
  currentQuestionIndex: number;

  @ApiProperty({ description: 'Количество правильных ответов' })
  @IsNumber()
  correctAnswersCount: number;

  @ApiProperty({ description: 'Общее количество очков' })
  @IsNumber()
  totalPoints: number;

  @ApiProperty({ description: 'Ответы пользователя' })
  @IsArray()
  answers: { questionId: number; answerId: number | null }[];

  @ApiProperty({ description: 'Информация о браузере' })
  @IsObject()
  browserInfo: BrowserInfoDto;
}