import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePrefabComponent } from './table-prefab.component';

describe('TablePrefabComponent', () => {
  let component: TablePrefabComponent;
  let fixture: ComponentFixture<TablePrefabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePrefabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablePrefabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
