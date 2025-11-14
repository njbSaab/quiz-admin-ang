import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAllPageComponent } from './quiz-all-page.component';

describe('QuizAllPageComponent', () => {
  let component: QuizAllPageComponent;
  let fixture: ComponentFixture<QuizAllPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizAllPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizAllPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
