import { Injectable, Logger } from '@nestjs/common';
import { On, Start, Command, Update, InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';
import { QuizzesService } from '../quizzes/quizzes.service';
import * as LocalSession from 'telegraf-session-local';
import { SubmitQuizDto } from '../quizzes/dto/submit-quiz.dto'; // Импорт DTO

// Расширяем интерфейс Context для поддержки session
interface SessionContext extends Context {
  session: {
    quizId?: number;
    currentQuestionIndex?: number;
    userAnswers?: { questionId: number; answerId: number }[];
  };
}

@Update()
@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly quizzesService: QuizzesService,
    @InjectBot() private readonly bot: Telegraf<SessionContext>,
  ) {
    this.logger.log('TelegramService initialized');
    // Инициализация сессии
    this.bot.use(
      new LocalSession({ database: 'session_db.json' }).middleware(),
    );
  }

  @Start()
  async onStart(ctx: SessionContext) {
    this.logger.log(
      `Received /start command from user: ${ctx.from?.username || 'unknown'}, chat ID: ${ctx.chat?.id}`,
    );
    await ctx.reply(
      'Welcome to the Quiz Bot! Use /quiz to see available quizzes or /startquiz <id> to start a quiz.',
    );
  }

  @Command('quiz')
  async onQuiz(ctx: SessionContext) {
    // this.logger.log(
    //   `Received /quiz command from user: ${ctx.from?.username || 'unknown'}, chat ID: ${ctx.chat?.id}`,
    // );
    // try {
    //   const quizzes = await this.quizzesService.findAll();
    //   const message = quizzes.length
    //     ? quizzes.map((q) => `${q.id}: ${q.title}`).join('\n')
    //     : 'No quizzes available';
    //   await ctx.reply(message);
    // } catch (error) {
    //   this.logger.error(`Error fetching quizzes: ${error.message}`);
    //   await ctx.reply('Error fetching quizzes. Please try again later.');
    // }
  }

  @Command('startquiz')
  async onStartQuiz(ctx: SessionContext) {
    // this.logger.log(
    //   `Received /startquiz command from user: ${ctx.from?.username || 'unknown'}, chat ID: ${ctx.chat?.id}`,
    // );

    // let quizId: number | undefined;

    // if (ctx.message && 'text' in ctx.message && typeof ctx.message.text === 'string') {
    //   const parts = ctx.message.text.split(' ');
    //   if (parts.length > 1) {
    //     quizId = parseInt(parts[1], 10);
    //   }
    // }

    // if (!quizId) {
    //   await ctx.reply('Please provide a quiz ID: /startquiz <id>');
    //   return;
    // }

    // try {
    //   const quiz = await this.quizzesService.findOne(quizId);
    //   if (!quiz || !quiz.isActive) {
    //     await ctx.reply('Quiz not found or not active');
    //     return;
    //   }

    //   // Сохраняем quizId и текущий вопрос в сессии
    //   ctx.session.quizId = quizId;
    //   ctx.session.currentQuestionIndex = 0;
    //   ctx.session.userAnswers = []; // Инициализируем массив ответов

    //   // Отправляем firstPage, если она есть
    //   if (quiz.firstPage) {
    //     await ctx.reply(quiz.firstPage);
    //   }

    //   // Отправляем первый вопрос
    //   const firstQuestion = quiz.questions[0];
    //   if (firstQuestion) {
    //     const message = `${firstQuestion.text}\n${firstQuestion.answers
    //       .map((a) => `${a.id}: ${a.text}`)
    //       .join('\n')}`;
    //     if (firstQuestion.image) {
    //       await ctx.replyWithPhoto(firstQuestion.image, { caption: message });
    //     } else {
    //       await ctx.reply(message);
    //     }
    //   } else {
    //     await ctx.reply('No questions available in this quiz.');
    //   }
    // } catch (error) {
    //   this.logger.error(`Error starting quiz: ${error.message}`);
    //   await ctx.reply('Error starting quiz. Please try again later.');
    // }
  }

  @On('text')
  async onText(ctx: SessionContext) {
    // if (ctx.message && 'text' in ctx.message && typeof ctx.message.text === 'string') {
    //   this.logger.log(
    //     `Received text: ${ctx.message.text} from user: ${ctx.from?.username || 'unknown'}, chat ID: ${ctx.chat?.id}`,
    //   );

    //   const quizId = ctx.session.quizId;
    //   const currentQuestionIndex = ctx.session.currentQuestionIndex;

    //   if (!quizId || currentQuestionIndex === undefined) {
    //     await ctx.reply('Please start a quiz first with /startquiz <id>');
    //     return;
    //   }

    //   const quiz = await this.quizzesService.findOne(quizId);
    //   if (!quiz || !quiz.isActive) {
    //     await ctx.reply('Quiz not found or not active');
    //     return;
    //   }

    //   const currentQuestion = quiz.questions[currentQuestionIndex];
    //   if (!currentQuestion) {
    //     await ctx.reply('No more questions in this quiz.');
    //     if (quiz.finalPage) {
    //       await ctx.reply(quiz.finalPage); // Отправляем finalPage
    //     }
    //     ctx.session.quizId = undefined; // Завершаем сессию
    //     ctx.session.currentQuestionIndex = undefined;
    //     ctx.session.userAnswers = undefined;
    //     return;
    //   }

    //   const answerId = parseInt(ctx.message.text, 10);
    //   const answer = currentQuestion.answers.find((a) => a.id === answerId);

    //   if (!answer) {
    //     await ctx.reply('Please select a valid answer ID.');
    //     return;
    //   }

    //   // Сохраняем ответ в сессии
    //   if (!ctx.session.userAnswers) {
    //     ctx.session.userAnswers = [];
    //   }
    //   ctx.session.userAnswers.push({ questionId: currentQuestion.id, answerId });

    //   // Переходим к следующему вопросу
    //   ctx.session.currentQuestionIndex += 1;
    //   const nextQuestion = quiz.questions[ctx.session.currentQuestionIndex];

    //   if (nextQuestion) {
    //     const message = `${nextQuestion.text}\n${nextQuestion.answers
    //       .map((a) => `${a.id}: ${a.text}`)
    //       .join('\n')}`;
    //     if (nextQuestion.image) {
    //       await ctx.replyWithPhoto(nextQuestion.image, { caption: message });
    //     } else {
    //       await ctx.reply(message);
    //     }
    //   } else {
    //     // Квиз завершён, отправляем результаты
    //     const submitDto: SubmitQuizDto = {
    //       user: {
    //         name: ctx.from?.username || 'Unknown',
    //         email: ctx.from?.id.toString() + '@telegram.com',
    //       },
    //       answers: ctx.session.userAnswers,
    //     };

    //     try {
    //       const result = await this.quizzesService.submitQuiz(quizId, submitDto);
    //       await ctx.reply(`Quiz completed! Your score: ${result.score}`);
    //       if (quiz.finalPage) {
    //         await ctx.reply(quiz.finalPage); // Отправляем finalPage
    //       }
    //     } catch (error) {
    //       this.logger.error(`Error submitting quiz: ${error.message}`);
    //       await ctx.reply('Error submitting quiz. Please try again later.');
    //     }

    //     // Очищаем сессию
    //     ctx.session.quizId = undefined;
    //     ctx.session.currentQuestionIndex = undefined;
    //     ctx.session.userAnswers = undefined;
    //   }
    // }
  }
}