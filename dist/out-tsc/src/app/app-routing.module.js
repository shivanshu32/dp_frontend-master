import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddOrderComponent } from './components/add-order/add-order.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { ClientordersComponent } from './components/client-orders/client-orders.component';
import { ClientComponent } from './components/client/client.component';
import { CreateuserComponent } from './components/create-user/create-user.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { LoginComponent } from './components/login/login.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { PrinterListComponent } from './components/printer-list/printer-list.component';
import { ProductionComponent } from './components/production/production.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecoverComponent } from './components/recover/recover.component';
import { SalesComponent } from './components/sales/sales.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { UserlistComponent } from './components/user-list/user-list.component';
import { ViewCalendarResourcesComponent } from './components/view-calendar-resources/view-calendar-resources.component';
import { ViewCalendarComponent } from './components/view-calendar/view-calendar.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
const routes = [
    { path: "login", component: LoginComponent },
    { path: "forgot-password", component: ForgotComponent },
    { path: "recover-password/:token", component: RecoverComponent },
    { path: "thank-you", component: ThankyouComponent },
    {
        path: "administrator",
        component: AdministratorComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ["Admin"] },
    },
    {
        path: "production",
        component: ProductionComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ["Production"] },
    },
    {
        path: "sales",
        component: SalesComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ["Sales"] },
    },
    {
        path: "client",
        component: ClientComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ["Customer"] },
    },
    {
        path: "add-order",
        canActivate: [AuthGuard],
        component: AddOrderComponent,
        data: { expectedRoles: ["Customer", "Sales", "Admin", "Production"] },
    },
    { path: "order-details", component: OrderDetailsComponent },
    { path: "profile", component: ProfileComponent },
    {
        path: "create-user",
        component: CreateuserComponent,
        data: { expectedRoles: ["Admin"] },
    },
    {
        path: "user-list",
        component: UserlistComponent,
        data: { expectedRoles: ["Admin"] },
    },
    {
        path: "client-orders",
        component: ClientordersComponent,
        data: { expectedRoles: ["Customer"] },
    },
    {
        path: "printer-list",
        component: PrinterListComponent,
        data: { expectedRoles: ["Admin"] },
    },
    {
        path: "view-calendar",
        component: ViewCalendarComponent,
        data: { expectedRoles: ["Admin"] },
    },
    {
        path: "view-calendar-resources",
        component: ViewCalendarResourcesComponent,
        data: { expectedRoles: ["Admin"] },
    },
    { path: "**", redirectTo: "login" },
];
let AppRoutingModule = /** @class */ (() => {
    let AppRoutingModule = class AppRoutingModule {
    };
    AppRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
})();
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map