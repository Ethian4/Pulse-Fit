import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlturaPage } from './altura.page';

describe('AlturaPage', () => {
  let component: AlturaPage;
  let fixture: ComponentFixture<AlturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
