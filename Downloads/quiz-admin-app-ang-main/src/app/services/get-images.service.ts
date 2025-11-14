import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetImagesService {
  private imageAddedSubject = new Subject<void>();
  private imageUrl = environment.apiUrl + '/images/';


  constructor(private http: HttpClient) {}

  getImages(): Observable<string[]> {
    return this.http.get<string[]>(this.imageUrl);
  }

  deleteImage(filename: string): Observable<void> {
    return this.http.delete<void>(`${this.imageUrl}${filename}`);
  }

  getImagesById(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.imageUrl}${id}`);
  }

  notifyImageAdded(): void {
    this.imageAddedSubject.next();
  }

  onImageAdded(): Observable<void> {
    return this.imageAddedSubject.asObservable();
  }
}