import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickGradeComponent } from './quick-grade.component';

describe('QuickGradeComponent', () => {
  let component: QuickGradeComponent;
  let fixture: ComponentFixture<QuickGradeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
