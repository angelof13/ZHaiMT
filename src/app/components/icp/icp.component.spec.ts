import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ICPComponent } from './icp.component';

describe('ICPComponent', () => {
  let component: ICPComponent;
  let fixture: ComponentFixture<ICPComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ICPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ICPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
