import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    providers: [PrismaService, ConfigService, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
