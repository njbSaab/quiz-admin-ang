import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        launchOptions: { dropPendingUpdates: true },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TelegramService, QuizzesService, PrismaService],
})
export class TelegramModule {}
