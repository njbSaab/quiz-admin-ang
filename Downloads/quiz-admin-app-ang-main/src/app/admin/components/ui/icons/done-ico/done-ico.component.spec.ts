import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneIcoComponent } from './done-ico.component';

describe('DoneIcoComponent', () => {
  let component: DoneIcoComponent;
  let fixture: ComponentFixture<DoneIcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoneIcoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneIcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
