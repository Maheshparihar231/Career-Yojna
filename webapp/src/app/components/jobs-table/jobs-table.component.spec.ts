import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsTableComponent } from './jobs-table.component';

describe('JobsTableComponent', () => {
  let component: JobsTableComponent;
  let fixture: ComponentFixture<JobsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobsTableComponent]
    });
    fixture = TestBed.createComponent(JobsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
