import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { GetImagesService } from '../../../services/get-images.service';
@Component({
  selector: 'app-added-image-page',
  templateUrl: './added-image-page.component.html',
  styleUrl: './added-image-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, 
  
})

export class AddedImagePageComponent {
  uploadedImages: string[] = [];
  @ViewChild('imageTableContainer', { static: false }) imageTableContainer!: ElementRef;

  constructor(
    private imageService: GetImagesService,
    private cdr: ChangeDetectorRef
  ) {}

  onImageUploaded(imageUrl: string): void {
    this.uploadedImages = [...this.uploadedImages, imageUrl];
    this.imageService.notifyImageAdded();
    this.cdr.markForCheck();
  }

  onScrollDownRequested(): void {
    if (this.imageTableContainer) {
      console.log('Scrolling container:', this.imageTableContainer.nativeElement);
      this.imageTableContainer.nativeElement.scrollBy({
        top: 1000,
        behavior: 'smooth'
      });
    } else {
      console.warn('imageTableContainer is not defined');
    }
  }
}
