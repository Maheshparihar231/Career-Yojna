import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiledataComponent } from './profiledata.component';

describe('ProfiledataComponent', () => {
  let component: ProfiledataComponent;
  let fixture: ComponentFixture<ProfiledataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfiledataComponent]
    });
    fixture = TestBed.createComponent(ProfiledataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
