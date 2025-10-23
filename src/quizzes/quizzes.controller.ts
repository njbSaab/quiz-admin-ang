import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { UserResultDto } from './dto/user-result.dto';
import { SecretWordGuard } from '../utils/guards/secret-word.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
  private readonly logger = new Logger(QuizzesController.name);

  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @UseGuards(SecretWordGuard)
  @ApiOperation({ summary: 'Создать новый квиз' })
  @ApiBody({ type: CreateQuizDto })
  @ApiResponse({ status: 201, description: 'Квиз успешно создан' })
  @ApiResponse({ status: 400, description: 'Неверные данные в запросе' })
  @ApiResponse({ status: 401, description: 'Неверный секретный ключ' })
  async create(@Body() createQuizDto: CreateQuizDto) {
    this.logger.log(`Received request to create quiz with title: ${createQuizDto.title}`);
    try {
      const quiz = await this.quizzesService.create(createQuizDto);
      this.logger.log(`Quiz created successfully: ID ${quiz.id}`);
      return quiz;
    } catch (error) {
      this.logger.error(`Failed to create quiz: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех квизов' })
  @ApiResponse({ status: 200, description: 'Список квизов успешно получен' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async findAll() {
    this.logger.log('Received request to fetch all quizzes');
    try {
      const quizzes = await this.quizzesService.findAll();
      this.logger.log(`Fetched ${quizzes.length} quizzes`);
      return quizzes;
    } catch (error) {
      this.logger.error(`Failed to fetch quizzes: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить квиз по ID' })
  @ApiParam({ name: 'id', description: 'ID квиза', type: Number })
  @ApiResponse({ status: 200, description: 'Квиз успешно получен' })
  @ApiResponse({ status: 404, description: 'Квиз не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Received request to fetch quiz with ID: ${id}`);
    try {
      const quiz = await this.quizzesService.findOne(id);
      this.logger.log(`Quiz with ID ${id} fetched successfully`);
      return quiz;
    } catch (error) {
      this.logger.error(`Failed to fetch quiz with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(SecretWordGuard)
  @ApiOperation({ summary: 'Обновить квиз по ID' })
  @ApiParam({ name: 'id', description: 'ID квиза', type: Number })
  @ApiBody({ type: UpdateQuizDto })
  @ApiResponse({ status: 200, description: 'Квиз успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Неверные данные в запросе' })
  @ApiResponse({ status: 401, description: 'Неверный секретный ключ' })
  @ApiResponse({ status: 404, description: 'Квиз не найден' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateQuizDto: UpdateQuizDto) {
    this.logger.log(`Received request to update quiz with ID: ${id}`);
    try {
      const quiz = await this.quizzesService.update(id, updateQuizDto);
      this.logger.log(`Quiz with ID ${id} updated successfully`);
      return quiz;
    } catch (error) {
      this.logger.error(`Failed to update quiz with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post(':id/submit')
  @UseGuards(SecretWordGuard)
  @ApiOperation({ summary: 'Отправить результаты квиза' })
  @ApiParam({ name: 'id', description: 'ID квиза', type: Number })
  @ApiBody({ type: UserResultDto })
  @ApiResponse({ status: 201, description: 'Результаты успешно сохранены' })
  @ApiResponse({ status: 400, description: 'Неверные данные в запросе' })
  @ApiResponse({ status: 401, description: 'Неверный секретный ключ' })
  @ApiResponse({ status: 404, description: 'Квиз не найден' })
  async submitQuiz(@Param('id', ParseIntPipe) id: number, @Body() resultData: UserResultDto) {
    this.logger.log(`Received request to submit quiz result for quiz ID: ${id}`);
    try {
      const result = await this.quizzesService.submitQuiz(id, resultData);
      this.logger.log(`Quiz result saved for quiz ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to save quiz result for quiz ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('statistics/:id')
  @UseGuards(SecretWordGuard)
  @ApiOperation({ summary: 'Получить статистику по квизу' })
  @ApiParam({ name: 'id', description: 'ID квиза', type: Number })
  @ApiResponse({ status: 200, description: 'Статистика успешно получена' })
  @ApiResponse({ status: 401, description: 'Неверный секретный ключ' })
  @ApiResponse({ status: 404, description: 'Квиз не найден' })
  async getStatistics(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Received request to fetch statistics for quiz ID: ${id}`);
    try {
      const stats = await this.quizzesService.getStatistics(id);
      this.logger.log(`Statistics fetched for quiz ID ${id}: ${stats.totalUsers} users`);
      return stats;
    } catch (error) {
      this.logger.error(`Failed to fetch statistics for quiz ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(SecretWordGuard)
  @ApiOperation({ summary: 'Удалить квиз по ID' })
  @ApiParam({ name: 'id', description: 'ID квиза', type: Number })
  @ApiResponse({ status: 200, description: 'Квиз успешно удален' })
  @ApiResponse({ status: 401, description: 'Неверный секретный ключ' })
  @ApiResponse({ status: 404, description: 'Квиз не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Received request to delete quiz with ID: ${id}`);
    try {
      const result = await this.quizzesService.remove(id);
      this.logger.log(`Quiz with ID ${id} deleted successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete quiz with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}