import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Доступен глобально
})
export class ImageValidatorService {
  private validDomains: string[] = ['https://kr.top4winners.top/images', 'https://i.ibb.co'];

  isValidImageUrl(url: string): boolean {
    if (!url) return true; // Пустой URL считается валидным
    return this.validDomains.some((domain) => url.startsWith(domain));
  }
}