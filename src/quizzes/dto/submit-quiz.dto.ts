import { IsString, IsNotEmpty, IsEmail, IsArray, ValidateNested, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty({ example: 'John Doe', description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Электронная почта пользователя' })
  @IsEmail()
  email: string;
}

class AnswerDto {
  @ApiProperty({ example: 1, description: 'ID вопроса' })
  @IsInt()
  questionId: number;

  @ApiProperty({ example: 1, description: 'ID выбранного ответа' })
  @IsInt()
  answerId: number;
}

export class SubmitQuizDto {
  @ApiProperty({ example: 'session-1234567890', description: 'ID сессии', required: false })
  @IsString()
  @IsOptional()
  sessionId?: string;

  @ApiProperty({ type: UserDto, description: 'Информация о пользователе' })
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({ type: [AnswerDto], description: 'Список ответов пользователя' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}