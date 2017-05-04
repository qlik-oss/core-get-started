import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { QlikComponent } from './qlik.component';

describe('QlikComponent (inline template)', () => {

  let comp:    QlikComponent;
  let fixture: ComponentFixture<QlikComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QlikComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QlikComponent);

    comp = fixture.componentInstance;

    // query for the version tag
    de = fixture.debugElement.query(By.css('#qix-version'));
    el = de.nativeElement;
  });
  it('unknown until manually call `detectChanges`', () => {
    expect(el.textContent).toEqual('unknown');
  });

  it('should display a version number', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain('12');
  });
});
