import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesreservationsComponent } from './mesreservations.component';

describe('MesreservationsComponent', () => {
  let component: MesreservationsComponent;
  let fixture: ComponentFixture<MesreservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesreservationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesreservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
