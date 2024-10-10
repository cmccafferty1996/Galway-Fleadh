import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlipsPermitsModalComponent } from './slips-permits-modal.component';

describe('SlipsPermitsModalComponent', () => {
  let component: SlipsPermitsModalComponent;
  let fixture: ComponentFixture<SlipsPermitsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlipsPermitsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlipsPermitsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
