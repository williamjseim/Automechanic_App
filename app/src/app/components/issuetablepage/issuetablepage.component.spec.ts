import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuetablepageComponent } from './issuetablepage.component';

describe('IssuetablepageComponent', () => {
  let component: IssuetablepageComponent;
  let fixture: ComponentFixture<IssuetablepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuetablepageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssuetablepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
