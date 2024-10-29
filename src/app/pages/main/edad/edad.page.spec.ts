import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdadPage } from './edad.page';

describe('EdadPage', () => {
  let component: EdadPage;
  let fixture: ComponentFixture<EdadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EdadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
