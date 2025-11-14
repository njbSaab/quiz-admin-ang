import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './users.service';
import { User } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root',
})
export class UserCountService {
  private userCountSubject = new BehaviorSubject<number>(this.getUserCountFromStorage());
  userCount$ = this.userCountSubject.asObservable();

  constructor(private userService: UserService) {}

  updateUserCount(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.userCountSubject.next(users.length);
        localStorage.setItem('userCount', users.length.toString());
        console.log('Количество пользователей обновлено:', users.length);
      },
      error: (error) => {
        console.error('Ошибка при обновлении количества пользователей:', error);
      },
    });
  }

  private getUserCountFromStorage(): number {
    const value = localStorage.getItem('userCount');
    return value ? parseInt(value, 10) : 0;
  }

  getUserCount(): Observable<number> {
    return this.userCount$;
  }
}