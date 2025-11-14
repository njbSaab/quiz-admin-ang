import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { GetImagesService } from '../../../../services/get-images.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-image-table',
  templateUrl: './image-table.component.html',
  styleUrl: './image-table.component.scss'
})
export class ImageTableComponent {
  @Input() images: string[] = [];
  copiedStates: boolean[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  baseUrl = environment.baseUrl + '/images/'; 

  constructor(
    private imageService: GetImagesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchImages();
    this.imageService.onImageAdded().subscribe(() => {
      this.fetchImages();
    });
  }

  fetchImages(): void {
    this.imageService.getImages().subscribe({
      next: (images) => {
        this.images = images;
        this.sortImages();
        this.copiedStates = new Array(this.images.length).fill(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = 'Ошибка при получении изображений';
        this.clearMessagesAfterDelay();
        this.cdr.markForCheck();
      }
    });
  }

  sortImages(): void {
    this.images.sort((a, b) => {
      const timestampA = this.extractTimestamp(a);
      const timestampB = this.extractTimestamp(b);
      return timestampB - timestampA;
    });
  }

  extractTimestamp(imagePath: string): number {
    const fileName = imagePath.split('/').pop() || imagePath;
    const match = fileName.match(/image-(\d+)-\d+\.\w+/);
    return match ? parseInt(match[1], 10) : 0;
  }

  copyImageUrl(image: string, index: number): void {
    // Убираем /images/ из начала пути, если оно есть
    const cleanImagePath = image.startsWith('/images/') ? image.replace('/images/', '') : image;
    const url = `${this.baseUrl}${cleanImagePath}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copiedStates[index] = true;
      setTimeout(() => {
        this.copiedStates[index] = false;
        this.cdr.markForCheck();
      }, 3000);
      this.cdr.markForCheck();
    }).catch(err => {
      this.errorMessage = 'Ошибка при копировании URL';
      this.clearMessagesAfterDelay();
      this.cdr.markForCheck();
    });
  }

  deleteImage(image: string, index: number): void {
    const filename = image.split('/').pop()!;
    this.imageService.deleteImage(filename).subscribe({
      next: () => {
        this.images = this.images.filter((_, i) => i !== index);
        this.copiedStates = this.copiedStates.filter((_, i) => i !== index);
        this.successMessage = `Изображение ${filename} успешно удалено`;
        this.clearMessagesAfterDelay();
        this.cdr.markForCheck();
      },
      error: (err) => {
        const msg = err.status === 404 ? 'Файл не найден' :
                    err.status === 400 ? 'Недопустимое имя файла' :
                    'Ошибка удаления изображения';
        this.errorMessage = msg;
        this.clearMessagesAfterDelay();
        this.cdr.markForCheck();
      }
    });
  }

  getImageUrl(image: string): string {
    // Убираем /images/ из начала пути для отображения и ссылок
    return image.startsWith('/images/') ? `${this.baseUrl}${image.replace('/images/', '')}` : `${this.baseUrl}${image}`;
  }

  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.markForCheck();
  }

  clearMessagesAfterDelay(): void {
    setTimeout(() => this.clearMessages(), 3000);
  }
}
