import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelIcoComponent } from './cancel-ico.component';

describe('CancelIcoComponent', () => {
  let component: CancelIcoComponent;
  let fixture: ComponentFixture<CancelIcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelIcoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelIcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
