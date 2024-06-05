import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterResetComponent } from './after-reset.component';

describe('AfterResetComponent', () => {
  let component: AfterResetComponent;
  let fixture: ComponentFixture<AfterResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterResetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
