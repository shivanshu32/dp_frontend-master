import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddOrderComponent } from "./components/add-order/add-order.component";
import { AdministratorComponent } from "./components/administrator/administrator.component";
import { ArtworkComponent } from "./components/artwork/artwork.component";
import { ClientordersComponent } from "./components/client-orders/client-orders.component";
import { ClientComponent } from "./components/client/client.component";
import { CreateuserComponent } from "./components/create-user/create-user.component";
import { ForgotComponent } from "./components/forgot/forgot.component";
import { ChecklistComponent } from "./components/checklist/checklist.component";
import { ShippingComponent } from "./shipping/shipping.component";

import { LoginComponent } from "./components/login/login.component";
import { NewSalesComponent } from "./components/new-sales/new-sales.component";
import { OrderDetailsComponent } from "./components/order-details/order-details.component";
import { PrinterListComponent } from "./components/printer-list/printer-list.component";
import { ProductionComponent } from "./components/production/production.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { PurchasingComponent } from "./components/purchasing/purchasing.component";
import { RecoverComponent } from "./components/recover/recover.component";
import { ResourceListComponent } from "./components/resource-list/resource-list.component";
import { ResourceOrderDetailsComponent } from "./components/resource-order-details/resource-order-details.component";
import { SalesComponent } from "./components/sales/sales.component";
import { ThankyouComponent } from "./components/thankyou/thankyou.component";
import { UserlistComponent } from "./components/user-list/user-list.component";
import { ViewCalendarResourcesComponent } from "./components/view-calendar-resources/view-calendar-resources.component";
import { ViewCalendarComponent } from "./components/view-calendar/view-calendar.component";
import { QRCodeComponent } from "./components/qrcode/qrcode.component";

import { AuthGuardService as AuthGuard } from "./services/auth-guard.service";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "forgot-password", component: ForgotComponent },
  { path: "recover-password/:token", component: RecoverComponent },
  { path: "thank-you", component: ThankyouComponent },
  { path: "resource-order-details", component: ResourceOrderDetailsComponent },
  {
    path: "administrator",
    component: AdministratorComponent,
    canActivate: [AuthGuard],
    data: { expectedRoles: ["Admin", "Sales"] },
  },
  {
    path: "checklist",
    component: ChecklistComponent,
    canActivate: [AuthGuard],
    data: { expectedRoles: ["Admin"] },
  },
  {
    path: "shipping",
    component: ShippingComponent,
    canActivate: [AuthGuard],
    data: { expectedRoles: ["Admin"] },
  },
  {
    path: "artwork",
    component: ArtworkComponent,
    canActivate: [AuthGuard],
    data: { expectedRoles: ["Admin"] },
  },
  {
    path: "purchasing",
    component: PurchasingComponent,
    canActivate: [AuthGuard],
    data: { expectedRoles: ["Admin"] },
  },
  {
    path: "qrcode",
    component: QRCodeComponent,
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
    path: "new-sales",
    component: NewSalesComponent,
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
    path: "resource-list",
    component: ResourceListComponent,
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
