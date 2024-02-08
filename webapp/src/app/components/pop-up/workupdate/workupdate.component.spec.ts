import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkupdateComponent } from './workupdate.component';

describe('WorkupdateComponent', () => {
  let component: WorkupdateComponent;
  let fixture: ComponentFixture<WorkupdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkupdateComponent]
    });
    fixture = TestBed.createComponent(WorkupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
