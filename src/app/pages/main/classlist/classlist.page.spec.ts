import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClasslistPage } from './classlist.page';

describe('ClasslistPage', () => {
  let component: ClasslistPage;
  let fixture: ComponentFixture<ClasslistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasslistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
