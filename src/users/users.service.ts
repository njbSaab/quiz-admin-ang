import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserSessionDataDto } from './dto/user-session-data.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async findAll() {
    this.logger.log('Fetching all users');
    try {
      const users = await this.prisma.user.findMany({
        include: {
          sessions: true,
          results: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      this.logger.log(`Found ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    this.logger.log(`Fetching user with ID: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          sessions: true,
          results: true,
        },
      });
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.logger.log(`User with ID ${id} fetched successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async addUser(userData: { name: string; email: string; uuid?: string; sessionId?: string }) {
    this.logger.log(`Adding user with email: ${userData.email}`);
    try {
      const uuid = userData.uuid || uuidv4();
      const user = await this.prisma.user.create({
        data: {
          uuid,
          name: userData.name,
          email: userData.email,
        },
      });

      // Этап 3: Связываем User с сессией и результатами по sessionId
      if (userData.sessionId) {
        await this.linkUserToSessionAndResult(uuid, userData.sessionId);
      }

      this.logger.log(`User created with ID: ${user.id}, UUID: ${uuid}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to add user: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async linkUserToSessionAndResult(uuid: string, sessionId: string) {
    try {
      // Обновляем UserSession
      const sessionUpdate = await this.prisma.userSession.updateMany({
        where: { sessionId },
        data: { userId: uuid },
      });

      // Обновляем UserResult
      const resultUpdate = await this.prisma.userResult.updateMany({
        where: { sessionId },
        data: { userId: uuid },
      });

      this.logger.log(
        `Linked user UUID ${uuid} to sessionId ${sessionId}. Updated ${sessionUpdate.count} sessions and ${resultUpdate.count} results`
      );
    } catch (error) {
      this.logger.error(`Failed to link user UUID ${uuid} to sessionId ${sessionId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    this.logger.log(`Deleting user with ID: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await this.prisma.user.delete({ where: { id } });
      this.logger.log(`User with ID ${id} deleted successfully`);
      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      this.logger.error(`Failed to delete user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async saveUserSession(sessionData: UserSessionDataDto) {
    this.logger.log(`Saving user session for session ID: ${sessionData.sessionId || 'new'}`);
    try {
      if (sessionData.quizId && sessionData.quizId !== 0) {
        const quiz = await this.prisma.quiz.findUnique({
          where: { id: sessionData.quizId },
        });
        if (!quiz) {
          this.logger.error(`Quiz with ID ${sessionData.quizId} not found`);
          throw new NotFoundException(`Quiz with ID ${sessionData.quizId} not found`);
        }
      }
  
      const sessionId = sessionData.sessionId || uuidv4();
      const userId = null; // null на этапах 1 и 2
  
      const existingSession = await this.prisma.userSession.findFirst({
        where: { sessionId },
      });
  
      if (existingSession) {
        const session = await this.prisma.userSession.update({
          where: { id: existingSession.id },
          data: {
            quizId: sessionData.quizId === 0 ? null : sessionData.quizId,
            userId,
            currentQuestionIndex: sessionData.currentQuestionIndex,
            correctAnswersCount: sessionData.correctAnswersCount,
            totalPoints: sessionData.totalPoints,
            answers: sessionData.answers as any,
            browserInfo: sessionData.browserInfo as any,
          },
        });
        this.logger.log(`User session updated for session ID: ${sessionId}`);
        return { session, userId: sessionId };
      }
  
      const session = await this.prisma.userSession.create({
        data: {
          quizId: sessionData.quizId === 0 ? null : sessionData.quizId,
          userId,
          sessionId,
          currentQuestionIndex: sessionData.currentQuestionIndex,
          correctAnswersCount: sessionData.correctAnswersCount,
          totalPoints: sessionData.totalPoints,
          answers: sessionData.answers as any,
          browserInfo: sessionData.browserInfo as any,
        },
      });
      this.logger.log(`User session saved for session ID: ${sessionId}`);
      return { session, userId: sessionId };
    } catch (error) {
      this.logger.error(`Failed to save user session: ${error.message}`, error.stack);
      throw error;
    }
  }
}