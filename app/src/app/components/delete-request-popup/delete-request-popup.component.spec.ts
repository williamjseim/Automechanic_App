import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRequestPopupComponent } from './delete-request-popup.component';

describe('DeleteRequestPopupComponent', () => {
  let component: DeleteRequestPopupComponent;
  let fixture: ComponentFixture<DeleteRequestPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRequestPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteRequestPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
