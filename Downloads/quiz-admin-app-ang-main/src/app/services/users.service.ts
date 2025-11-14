// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserResult, UserSession } from '../interfaces/users.interface';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private secretWord = 'TOPWINNER_TOP_QUIZWIZ_WORLD';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Secret-Word': this.secretWord,
      'Content-Type': 'application/json',
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders(),
    });
  }

  getCombinedUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/combined`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  saveUserSession(sessionData: UserSession): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/session`, sessionData, {
      headers: this.getAuthHeaders(),
    });
  }

  saveUserResult(result: UserResult): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/result`, result, {
      headers: this.getAuthHeaders(),
    });
  }
}