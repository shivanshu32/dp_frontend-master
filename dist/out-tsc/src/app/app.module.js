import { __decorate } from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { RecoverComponent } from './components/recover/recover.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { ProductionComponent } from './components/production/production.component';
import { SalesComponent } from './components/sales/sales.component';
import { ClientComponent } from './components/client/client.component';
import { AddOrderComponent } from './components/add-order/add-order.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './dumb-components/navbar/navbar.component';
import { NavbarclientComponent } from './dumb-components/navbarclient/navbarclient.component';
import { CommonModule } from '@angular/common';
import { CreateuserComponent } from './components/create-user/create-user.component';
import { UserlistComponent } from './components/user-list/user-list.component';
import { ClientordersComponent } from './components/client-orders/client-orders.component';
import { PrinterListComponent } from './components/printer-list/printer-list.component';
import { ViewCalendarComponent } from './components/view-calendar/view-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin
// import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { ViewCalendarResourcesComponent } from './components/view-calendar-resources/view-calendar-resources.component';
FullCalendarModule.registerPlugins([
    // register FullCalendar plugins
    dayGridPlugin,
    timeGridPlugin,
    resourceTimelinePlugin,
]);
let AppModule = /** @class */ (() => {
    let AppModule = class AppModule {
    };
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent,
                LoginComponent,
                ForgotComponent,
                RecoverComponent,
                ThankyouComponent,
                AdministratorComponent,
                ProductionComponent,
                SalesComponent,
                ClientComponent,
                AddOrderComponent,
                OrderDetailsComponent,
                ProfileComponent,
                NavbarComponent,
                NavbarclientComponent,
                CreateuserComponent,
                UserlistComponent,
                ClientordersComponent,
                PrinterListComponent,
                ViewCalendarComponent,
                ViewCalendarResourcesComponent,
            ],
            imports: [
                BrowserModule,
                FormsModule,
                CommonModule,
                AppRoutingModule,
                HttpClientModule,
                ReactiveFormsModule,
                FullCalendarModule,
            ],
            providers: [AuthService],
            bootstrap: [AppComponent],
        })
    ], AppModule);
    return AppModule;
})();
export { AppModule };
//# sourceMappingURL=app.module.js.map