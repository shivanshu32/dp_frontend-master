import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientordersComponent } from './client-orders.component';

describe('ClientordersComponent', () => {
  let component: ClientordersComponent;
  let fixture: ComponentFixture<ClientordersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientordersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
