import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../interfaces/quiz.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = environment.apiUrl;
  private secretWord = 'TOPWINNER_TOP_QUIZWIZ_WORLD';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Secret-Word': this.secretWord,
      'Content-Type': 'application/json',
    });
  }

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/quizzes`);
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/quizzes/${id}`);
  }

  addQuiz(quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiUrl}/quizzes`, quiz, {
      headers: this.getAuthHeaders(),
    });
  }

  updateQuiz(id: number, quiz: Partial<Quiz>): Observable<Quiz> {
    const cleanedQuiz = {
      ...quiz,
      questions: quiz.questions?.map((q) => {
        const { id, ...questionRest } = q;
        return {
          ...questionRest,
          id: id && id !== 0 ? id : undefined,
          answers: q.answers?.map((a) => {
            const { id, ...answerRest } = a;
            return id && id !== 0 ? { id, ...answerRest } : answerRest;
          }) || [],
        };
      }) || [],
    };
    return this.http.patch<Quiz>(`${this.apiUrl}/quizzes/${id}`, cleanedQuiz, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/quizzes/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  submitQuiz(
    id: number,
    submission: { user: { name: string; email: string }; answers: { questionId: number; answerId: number }[] }
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/quizzes/submit/${id}`, submission, {
      headers: this.getAuthHeaders(),
    });
  }

  getQuizStatistics(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quizzes/statistics/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}