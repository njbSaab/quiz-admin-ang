import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { ImageUploadService } from '../../../../services/image-upload.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isDragOver: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  @Output() imageUploaded = new EventEmitter<string>();
  @Output() scrollDownRequested = new EventEmitter<void>(); // Новое событие для прокрутки

  constructor(
    private imageUploadService: ImageUploadService,
    private cdr: ChangeDetectorRef
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
    this.cdr.markForCheck();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    this.cdr.markForCheck();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
        this.previewFile(file);
      }
      event.dataTransfer.clearData();
    }
    this.cdr.markForCheck();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
        this.previewFile(file);
      }
    }
    this.cdr.markForCheck();
  }

  validateFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.errorMessage = 'Разрешены только изображения (jpeg, jpg, png, svg, webp, gif)';
      this.clearMessagesAfterDelay();
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      this.errorMessage = 'Размер файла не должен превышать 5 МБ';
      this.clearMessagesAfterDelay();
      return false;
    }
    return true;
  }

  previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Выберите файл для загрузки';
      this.clearMessagesAfterDelay();
      return;
    }
    this.imageUploadService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.imageUploaded.emit(response.path);
        this.successMessage = 'Изображение успешно загружено';
        this.selectedFile = null;
        this.previewUrl = null;
        this.scrollDownRequested.emit(); // Вызываем событие прокрутки
        this.clearMessagesAfterDelay();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = 'Ошибка загрузки изображения';
        this.clearMessagesAfterDelay();
        this.cdr.markForCheck();
      }
    });
  }

  scrollDown(): void {
    this.scrollDownRequested.emit(); // Вызываем событие для родителя
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
