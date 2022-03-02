import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCalendarResourcesComponent } from './view-calendar-resources.component';

describe('ViewCalendarResourcesComponent', () => {
  let component: ViewCalendarResourcesComponent;
  let fixture: ComponentFixture<ViewCalendarResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCalendarResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCalendarResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
