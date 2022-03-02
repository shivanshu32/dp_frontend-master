import { async, TestBed } from '@angular/core/testing';
import { ViewCalendarResourcesComponent } from './view-calendar-resources.component';
describe('ViewCalendarResourcesComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ViewCalendarResourcesComponent]
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
//# sourceMappingURL=view-calendar-resources.component.spec.js.map