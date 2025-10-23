import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { UserResultDto } from './dto/user-result.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class QuizzesService {
  private readonly logger = new Logger(QuizzesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    this.logger.log(`Creating new quiz with title: ${createQuizDto.title}`);
    try {
      const quiz = await this.prisma.quiz.create({
        data: {
          title: createQuizDto.title,
          description: createQuizDto.description,
          firstPage: createQuizDto.firstPage,
          finalPage: createQuizDto.finalPage,
          isActive: createQuizDto.isActive ?? true,
          previewImage: createQuizDto.previewImage,
          categoryId: createQuizDto.categoryId,
          questions: {
            create: createQuizDto.questions.map((question) => ({
              text: question.text,
              image: question.image,
              order: question.order,
              answers: {
                create: question.answers.map((answer) => ({
                  text: answer.text,
                  isCorrect: answer.isCorrect,
                  points: answer.points,
                })),
              },
            })),
          },
        },
        include: { questions: { include: { answers: true } } },
      });
      this.logger.log(`Quiz created successfully: ID ${quiz.id}`);
      return quiz;
    } catch (error) {
      this.logger.error(`Failed to create quiz: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    this.logger.log('Fetching all active quizzes');
    try {
      const quizzes = await this.prisma.quiz.findMany({
        // where: { isActive: true },
        include: { questions: { include: { answers: true } }, category: true },
        orderBy: { createdAt: 'desc' },
      });
      this.logger.log(`Found ${quizzes.length} active quizzes`);
      return quizzes;
    } catch (error) {
      this.logger.error(`Failed to fetch quizzes: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    this.logger.log(`Fetching quiz with ID: ${id}`);
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id },
        include: {
          questions: { include: { answers: true }, orderBy: { order: 'asc' } },
          category: true,
        },
      });
      if (!quiz) {
        this.logger.warn(`Quiz with ID ${id} not found`);
        throw new NotFoundException(`Quiz with ID ${id} not found`);
      }
      this.logger.log(`Quiz with ID ${id} fetched successfully`);
      return quiz;
    } catch (error) {
      this.logger.error(`Failed to fetch quiz with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    this.logger.log(`Updating quiz with ID: ${id}`);
    try {
      const { title, description, firstPage, finalPage, isActive, previewImage, categoryId, questions } = updateQuizDto;

      const quiz = await this.prisma.quiz.findUnique({ where: { id } });
      if (!quiz) {
        this.logger.warn(`Quiz with ID ${id} not found`);
        throw new NotFoundException(`Quiz with ID ${id} not found`);
      }

      const updatedQuiz = await this.prisma.quiz.update({
        where: { id },
        data: {
          title: title ?? undefined,
          description: description ?? undefined,
          firstPage: firstPage ?? undefined,
          finalPage: finalPage ?? undefined,
          isActive: isActive ?? undefined,
          previewImage: previewImage ?? undefined,
          categoryId: categoryId ?? undefined,
        },
      });

      if (questions) {
        this.logger.log(`Replacing questions for quiz ID: ${id}`);
        await this.prisma.question.deleteMany({ where: { quizId: id } });

        await this.prisma.question.createMany({
          data: questions.map((question) => ({
            quizId: id,
            text: question.text,
            image: question.image,
            order: question.order,
          })),
        });

        const newQuestions = await this.prisma.question.findMany({
          where: { quizId: id },
          select: { id: true, text: true },
        });

        for (const question of questions) {
          const matchingQuestion = newQuestions.find((q) => q.text === question.text);
          if (matchingQuestion && question.answers) {
            await this.prisma.answer.createMany({
              data: question.answers.map((answer) => ({
                questionId: matchingQuestion.id,
                text: answer.text,
                isCorrect: answer.isCorrect,
                points: answer.points,
              })),
            });
          }
        }
        this.logger.log(`Questions and answers updated for quiz ID: ${id}`);
      }

      const result = await this.prisma.quiz.findUnique({
        where: { id },
        include: {
          questions: { include: { answers: true }, orderBy: { order: 'asc' } },
          category: true,
        },
      });
      this.logger.log(`Quiz with ID ${id} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update quiz with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async submitQuiz(quizId: number, submitDto: UserResultDto) {
    this.logger.log(`Submitting quiz ID: ${quizId} with session ID: ${submitDto.sessionId || 'none'}`);
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id: quizId },
        include: { questions: { include: { answers: true } } },
      });
      if (!quiz || !quiz.isActive) {
        this.logger.error(`Quiz with ID ${quizId} not found or not active`);
        throw new NotFoundException(`Quiz with ID ${quizId} not found or not active`);
      }
  
      const userId = null;
  
      let score = 0;
      submitDto.answers.forEach((userAnswer) => {
        const question = quiz.questions.find((q) => q.id === userAnswer.questionId);
        if (question) {
          const correctAnswer = question.answers.find((a) => a.id === userAnswer.answerId && a.isCorrect);
          if (correctAnswer) {
            score += correctAnswer.points;
          }
        }
      });
  
      const result = await this.prisma.userResult.create({
        data: {
          userId,
          quizId,
          sessionId: submitDto.sessionId || null,
          score,
          answers: submitDto.answers as any,
        },
      });
  
      this.logger.log(`Quiz ID ${quizId} submitted successfully with session ID ${submitDto.sessionId}. Score: ${score}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to submit quiz ID ${quizId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getStatistics(quizId: number) {
    this.logger.log(`Fetching statistics for quiz ID: ${quizId}`);
    try {
      const results = await this.prisma.userResult.findMany({
        where: { quizId },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });

      const totalUsers = results.length;
      const averageScore = totalUsers ? results.reduce((sum, r) => sum + r.score, 0) / totalUsers : 0;

      const stats = {
        totalUsers,
        averageScore,
        results: results.map((r) => ({
          userName: r.user?.name ?? 'Anonymous',
          score: r.score,
          answers: r.answers,
        })),
      };
      this.logger.log(`Statistics fetched for quiz ID ${quizId}: ${totalUsers} users, average score ${averageScore}`);
      return stats;
    } catch (error) {
      this.logger.error(`Failed to fetch statistics for quiz ID ${quizId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    this.logger.log(`Deleting quiz with ID: ${id}`);
    try {
      const quiz = await this.prisma.quiz.findUnique({ where: { id } });
      if (!quiz) {
        this.logger.warn(`Quiz with ID ${id} not found`);
        throw new NotFoundException(`Quiz with ID ${id} not found`);
      }
      await this.prisma.quiz.delete({ where: { id } });
      this.logger.log(`Quiz with ID ${id} deleted successfully`);
      return { message: `Quiz with ID ${id} deleted successfully` };
    } catch (error) {
      this.logger.error(`Failed to delete quiz with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}