import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseIntPipe, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSessionDataDto } from './dto/user-session-data.dto';
import { SecretWordGuard } from '../utils/guards/secret-word.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(SecretWordGuard)
  @ApiOperation({ summary: 'Получить список всех пользователей' })
  @ApiResponse({ status: 200, description: 'Список пользователей успешно получен' })
  @ApiResponse({ status: 401, description: 'Неверный секретный ключ' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async findAll() {
    this.logger.log('Received request to fetch all users');
    try {
      const users = await this.usersService.findAll();
      this.logger.log(`Fetched ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(SecretWordGuard)
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: Number })
  @ApiResponse({ status: 200, description: 'Пользователь успешно получен' })
  @ApiResponse({ status: 401, description: 'Неверный секретный ключ' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Received request to fetch user with ID: ${id}`);
    try {
      const user = await this.usersService.findOne(id);
      this.logger.log(`User with ID ${id} fetched successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post()
  @UseGuards(SecretWordGuard)
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiBody({ schema: { example: { name: 'John Doe', email: 'john@example.com' } } })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 400, description: 'Неверные данные в запросе' })
  @ApiResponse({ status: 401, description: 'Неверный секретный ключ' })
  async addUser(@Body() userData: { name: string; email: string }) {
    this.logger.log(`Received request to add user with email: ${userData.email}`);
    try {
      const user = await this.usersService.addUser(userData);
      this.logger.log(`User created with ID: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to add user: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(SecretWordGuard)
  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: Number })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: 401, description: 'Неверный секретный ключ' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Received request to delete user with ID: ${id}`);
    try {
      const result = await this.usersService.remove(id);
      this.logger.log(`User with ID ${id} deleted successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('session')
  @UseGuards(SecretWordGuard)
  @ApiOperation({ summary: 'Сохранить данные сессии пользователя' })
  @ApiBody({ type: UserSessionDataDto })
  @ApiResponse({ status: 201, description: 'Данные сессии успешно сохранены' })
  @ApiResponse({ status: 400, description: 'Неверные данные в запросе' })
  @ApiResponse({ status: 401, description: 'Неверный секретный ключ' })
  async saveUserSession(@Body() sessionData: UserSessionDataDto) {
    this.logger.log(`Received request to save user session for quiz ID: ${sessionData.quizId}`);
    try {
      const session = await this.usersService.saveUserSession(sessionData);
      this.logger.log(`User session saved for quiz ID: ${sessionData.quizId}`);
      return session;
    } catch (error) {
      this.logger.error(`Failed to save user session: ${error.message}`, error.stack);
      throw error;
    }
  }
}