import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuizService } from '../../../services/quiz.service';
import { NotificationService } from '../../../services/notification.service';
import { Quiz } from '../../../interfaces/quiz.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-added-page',
  templateUrl: './added-page.component.html',
  styleUrls: ['./added-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddedPageComponent implements OnInit {
  newQuiz: Partial<Quiz> = {
    title: '',
    description: '',
    firstPage: '',
    finalPage: '',
    previewImage: 'https://i.ibb.co/5X5Jxv13/quiz2.png',
    isActive: false,
    questions: [
      {
        text: '',
        order: 1,
        answers: [
          { text: '', isCorrect: false, points: 0 },
          { text: '', isCorrect: false, points: 0 },
        ],
      },
    ],
  };
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private quizService: QuizService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  isValidImageUrl(url: string | undefined): boolean {
    if (!url?.trim()) return true; // Пустой URL допустим
    const validDomains = [
      'https://1xarea.com/tgadmin',
      'https://i.ibb.co',
      'https://kr.top4winners.top', // Добавляем новый домен
    ];
    return (
      validDomains.some((domain) => url.startsWith(domain)) &&
      url.match(/\.(jpg|jpeg|png|gif)$/i) !== null
    );
  }

  refreshImage(): void {
    if (this.newQuiz.previewImage && !this.isValidImageUrl(this.newQuiz.previewImage)) {
      this.notificationService.showError('Неверный URL изображения. Используйте ссылки с разрешенных доменов (jpg, jpeg, png, gif).');
      this.newQuiz.previewImage = '';
    }
    this.cdr.markForCheck();
  }

  saveQuiz(): void {
    if (!this.newQuiz) return;

    // Проверка обязательных полей
    if (!this.newQuiz.title?.trim()) {
      this.notificationService.showError('Название квиза обязательно');
      this.cdr.markForCheck();
      return;
    }

    // Проверка валидности изображения
    if (this.newQuiz.previewImage && !this.isValidImageUrl(this.newQuiz.previewImage)) {
      this.notificationService.showError('Неверный URL изображения превью');
      this.cdr.markForCheck();
      return;
    }

    // Проверка вопросов и ответов
    if (this.newQuiz.questions) {
      for (const question of this.newQuiz.questions) {
        if (!question.text?.trim()) {
          this.notificationService.showError('Все вопросы должны иметь текст');
          this.cdr.markForCheck();
          return;
        }
        if (!question.answers || question.answers.length === 0) {
          this.notificationService.showError('Каждый вопрос должен иметь хотя бы один ответ');
          this.cdr.markForCheck();
          return;
        }
        for (const answer of question.answers) {
          if (!answer.text?.trim()) {
            this.notificationService.showError('Все ответы должны иметь текст');
            this.cdr.markForCheck();
            return;
          }
        }
      }
    }

    // Устанавливаем флаг загрузки
    this.isLoading = true;
    this.cdr.markForCheck();

    // Подготовка данных для отправки
    const quizData = {
      ...this.newQuiz,
      questions: this.newQuiz.questions?.map((q) => ({
        text: q.text,
        image: q.image,
        order: q.order,
        answers: q.answers?.map((a) => ({
          text: a.text,
          isCorrect: a.isCorrect,
          points: a.points,
        })),
      })),
    };

    console.log('Sending quiz:', JSON.stringify(quizData, null, 2));

    this.quizService.addQuiz(quizData).subscribe({
      next: (createdQuiz) => {
        this.isLoading = false;
        this.notificationService.showSuccess('Квиз успешно создан!');
        this.router.navigate(['/admin/quizzes', createdQuiz.id]);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Ошибка создания квиза: ' + err.message;
        this.notificationService.showError(this.errorMessage);
        this.cdr.markForCheck();
      },
    });
  }

  clearForm(): void {
    this.newQuiz = {
      title: '',
      description: '',
      firstPage: '',
      finalPage: '',
      previewImage: 'https://i.ibb.co/5X5Jxv13/quiz2.png',
      isActive: false,
      questions: [
        {
          text: '',
          order: 1,
          answers: [
            { text: '', isCorrect: false, points: 0 },
            { text: '', isCorrect: false, points: 0 },
          ],
        },
      ],
    };
    this.errorMessage = null;
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  addQuestion(): void {
    if (!this.newQuiz) return;
    this.newQuiz.questions = this.newQuiz.questions || [];
    this.newQuiz.questions.push({
      text: '',
      order: this.newQuiz.questions.length + 1,
      answers: [
        { text: '', isCorrect: false, points: 0 },
        { text: '', isCorrect: false, points: 0 },
      ],
    });
    this.cdr.markForCheck();
  }

  addAnswer(questionIndex: number): void {
    if (!this.newQuiz || !this.newQuiz.questions) return;
    this.newQuiz.questions[questionIndex].answers =
      this.newQuiz.questions[questionIndex].answers || [];
    this.newQuiz.questions[questionIndex].answers.push({
      text: '',
      isCorrect: false,
      points: 0,
    });
    this.cdr.markForCheck();
  }

  removeQuestion(questionIndex: number): void {
    if (!this.newQuiz || !this.newQuiz.questions) return;
    this.newQuiz.questions.splice(questionIndex, 1);
    this.newQuiz.questions.forEach((q, i) => (q.order = i + 1));
    this.cdr.markForCheck();
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    if (!this.newQuiz || !this.newQuiz.questions) return;
    this.newQuiz.questions[questionIndex].answers.splice(answerIndex, 1);
    this.cdr.markForCheck();
  }
}