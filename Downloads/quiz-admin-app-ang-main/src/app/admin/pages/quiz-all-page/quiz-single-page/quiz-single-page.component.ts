import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../../services/quiz.service';
import { Quiz } from '../../../../interfaces/quiz.interface';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-quiz-single-page',
  templateUrl: './quiz-single-page.component.html',
  styleUrls: ['./quiz-single-page.component.scss'],
})
export class QuizSinglePageComponent implements OnInit {
  quiz: Quiz | null = null;
  loading: boolean = true;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  isEditing: boolean = false;
  editedQuiz: Partial<Quiz> | null = null;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private notificationService: NotificationService,
    // private cdr: ChangeDetectorRef,
    private router: Router,

  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadQuiz(id);
    }
  }

  loadQuiz(id: number): void {
    this.quizService.getQuizById(id).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.editedQuiz = {
          ...quiz,
          questions: quiz.questions?.map(q => ({
            ...q,
            answers: q.answers?.map(a => ({ ...a })) || [],
          })) || [],
        };
        console.log('Loaded quiz:', JSON.stringify(this.quiz, null, 2));
        console.log('Edited quiz:', JSON.stringify(this.editedQuiz, null, 2));
        this.loading = false;
     
      },
      error: (err) => {
        this.errorMessage = 'Ошибка загрузки квиза: ' + err.message;
        this.notificationService.showError(this.errorMessage);
        this.loading = false;
     
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.quiz) {
      this.editedQuiz = {
        ...this.quiz,
        questions: this.quiz.questions?.map(q => ({
          ...q,
          answers: q.answers?.map(a => ({ ...a })) || [],
        })) || [],
      };
      console.log('Restored editedQuiz:', JSON.stringify(this.editedQuiz, null, 2));
    }
 
  }

  isValidImageUrl(url: string | undefined): boolean {
    if (!url) return true;
    const validDomains = ['https://1xjet.jp', 'https://1xjet.netlify.app', 'https://example.com', 'https://i.ibb.co'];
    return validDomains.some(domain => url.startsWith(domain)) && url.match(/\.(jpg|jpeg|png|gif)$/i) !== null;
  }

  saveChanges(): void {
    if (!this.quiz || !this.editedQuiz) return;

    if (!this.editedQuiz.title?.trim()) {
      this.notificationService.showError('Название квиза обязательно');
   
      return;
    }

    if (this.editedQuiz.questions) {
      for (const question of this.editedQuiz.questions) {
        if (!question.text?.trim()) {
          this.notificationService.showError('Все вопросы должны иметь текст');
       
          return;
        }
        if (!question.answers || question.answers.length === 0) {
          this.notificationService.showError('Каждый вопрос должен иметь хотя бы один ответ');
       
          return;
        }
        for (const answer of question.answers) {
          if (!answer.text?.trim()) {
            this.notificationService.showError('Все ответы должны иметь текст');
         
            return;
          }
        }
      }
    }

    console.log('Saving quiz:', JSON.stringify(this.editedQuiz, null, 2));

    this.isLoading = true;
 

    const { img, rating, text, extraText, ...quizData } = this.editedQuiz;

    this.quizService.updateQuiz(this.quiz.id, quizData).subscribe({
      next: (updatedQuiz) => {
        this.isLoading = false;
        this.quiz = updatedQuiz;
        this.editedQuiz = {
          ...updatedQuiz,
          questions: updatedQuiz.questions?.map(q => ({
            ...q,
            answers: q.answers?.map(a => ({ ...a })) || [],
          })) || [],
        };
        this.isEditing = false;
        this.notificationService.showSuccess('Квиз успешно обновлен!');
        console.log('Updated quiz:', JSON.stringify(updatedQuiz, null, 2));
     
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Ошибка обновления квиза: ' + err.message;
        this.notificationService.showError(this.errorMessage);
     
      }
    });
  }
  deleteQuiz(): void {
    if (!this.quiz || !this.quiz.id) return;

    this.isLoading = true;
 

    this.quizService.deleteQuiz(this.quiz.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.showSuccess('Квиз успешно удален!');
        this.router.navigate(['/admin/all-quizes']);
     
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Ошибка удаления квиза: ' + err.message;
        this.notificationService.showError(this.errorMessage);
     
      }
    });
  }
  addQuestion(): void {
    if (!this.editedQuiz) return;
    this.editedQuiz.questions = this.editedQuiz.questions || [];
    this.editedQuiz.questions.push({
      id: 0,
      text: '',
      order: this.editedQuiz.questions.length + 1,
      answers: [{ id: 0, text: '', isCorrect: false, points: 0 }],
    });
    console.log('Added question:', JSON.stringify(this.editedQuiz.questions, null, 2));
 
  }

  addAnswer(questionIndex: number): void {
    if (!this.editedQuiz || !this.editedQuiz.questions) return;
    this.editedQuiz.questions[questionIndex].answers = this.editedQuiz.questions[questionIndex].answers || [];
    this.editedQuiz.questions[questionIndex].answers.push({ id: 0, text: '', isCorrect: false, points: 0 });
    console.log(`Added answer to question ${questionIndex}:`, JSON.stringify(this.editedQuiz.questions[questionIndex].answers, null, 2));
 
  }

  removeQuestion(questionIndex: number): void {
    if (!this.editedQuiz || !this.editedQuiz.questions) return;
    this.editedQuiz.questions.splice(questionIndex, 1);
    this.editedQuiz.questions.forEach((q, i) => q.order = i + 1);
    console.log('Removed question:', JSON.stringify(this.editedQuiz.questions, null, 2));
 
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    if (!this.editedQuiz || !this.editedQuiz.questions) return;
    this.editedQuiz.questions[questionIndex].answers.splice(answerIndex, 1);
    console.log(`Removed answer from question ${questionIndex}:`, JSON.stringify(this.editedQuiz.questions[questionIndex].answers, null, 2));
 
  }
}