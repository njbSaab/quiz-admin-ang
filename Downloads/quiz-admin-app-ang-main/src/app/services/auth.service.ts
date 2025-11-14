import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedIn = false;
  private baseUrl = 'https://orm.top4winners.top/api/admin-auth'; // ⚠️ адаптируй при деплое

  constructor(private http: HttpClient, private router: Router) {}

  login(login: string, password: string): Promise<boolean> {
    return this.http
      .post<any>(`${this.baseUrl}/login`, { login, password })
      .toPromise()
      .then((user) => {
        this.isLoggedIn = true;
        sessionStorage.setItem('auth', 'true');
        sessionStorage.setItem('isAvailable', 'true');
        sessionStorage.setItem('role', user.role);
        sessionStorage.setItem('login', user.login);
        return true;
      })
      .catch(() => false);
  }
  
  getLogin(): string | null {
    return sessionStorage.getItem('login');
  }
  
  logout(): void {
    this.isLoggedIn = false;
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
  
  isAuthenticated(): boolean {
    return this.isLoggedIn || sessionStorage.getItem('auth') === 'true';
  }
  
  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

}