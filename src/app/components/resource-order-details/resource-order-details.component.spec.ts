import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceOrderDetailsComponent } from './resource-order-details.component';

describe('ResourceOrderDetailsComponent', () => {
  let component: ResourceOrderDetailsComponent;
  let fixture: ComponentFixture<ResourceOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceOrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
