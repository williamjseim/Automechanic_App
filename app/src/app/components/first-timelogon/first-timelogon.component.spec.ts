import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTimelogonComponent } from './first-timelogon.component';

describe('FirstTimelogonComponent', () => {
  let component: FirstTimelogonComponent;
  let fixture: ComponentFixture<FirstTimelogonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstTimelogonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirstTimelogonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
