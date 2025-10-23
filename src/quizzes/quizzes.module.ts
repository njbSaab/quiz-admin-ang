import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { PrismaService } from '../prisma.service';
import { SecretWordGuard } from '../utils/guards/secret-word.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService, PrismaService, ConfigService],
  exports: [QuizzesService],
})
export class QuizzesModule {}