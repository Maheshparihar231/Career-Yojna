import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDatailComponent } from './job-datail.component';

describe('JobDatailComponent', () => {
  let component: JobDatailComponent;
  let fixture: ComponentFixture<JobDatailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobDatailComponent]
    });
    fixture = TestBed.createComponent(JobDatailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
