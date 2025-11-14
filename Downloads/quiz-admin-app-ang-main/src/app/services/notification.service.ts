import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Доступен глобально
})
export class NotificationService {
  private successMessageSource = new BehaviorSubject<string | null>(null);
  private errorMessageSource = new BehaviorSubject<string | null>(null);

  successMessage$ = this.successMessageSource.asObservable();
  errorMessage$ = this.errorMessageSource.asObservable();

  // Показать сообщение об успехе
  showSuccess(message: string, timeout: number = 6000): void {
    this.successMessageSource.next(message);
    setTimeout(() => this.clearSuccess(), timeout); // Автоматически скрыть через timeout (по умолчанию 3 секунды)
  }

  // Показать сообщение об ошибке
  showError(message: string, timeout: number = 6000): void {
    this.errorMessageSource.next(message);
    setTimeout(() => this.clearError(), timeout); // Автоматически скрыть через timeout
  }

  // Очистить сообщение об успехе
  clearSuccess(): void {
    this.successMessageSource.next(null);
  }

  // Очистить сообщение об ошибке
  clearError(): void {
    this.errorMessageSource.next(null);
  }
}