import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileupdateComponent } from './profileupdate.component';

describe('ProfileupdateComponent', () => {
  let component: ProfileupdateComponent;
  let fixture: ComponentFixture<ProfileupdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileupdateComponent]
    });
    fixture = TestBed.createComponent(ProfileupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
