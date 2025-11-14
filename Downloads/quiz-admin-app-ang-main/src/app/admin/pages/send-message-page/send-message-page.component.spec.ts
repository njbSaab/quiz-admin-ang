import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMessagePageComponent } from './send-message-page.component';

describe('SendMessagePageComponent', () => {
  let component: SendMessagePageComponent;
  let fixture: ComponentFixture<SendMessagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendMessagePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendMessagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
