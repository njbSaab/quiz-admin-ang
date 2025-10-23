import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { TelegramModule } from './telegram/telegram.module'; 
import { PrismaService } from './prisma.service';
import { QuizzesModule } from './quizzes/quizzes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TelegramModule,
    QuizzesModule,
    UsersModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}