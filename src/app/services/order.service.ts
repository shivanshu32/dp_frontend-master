import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { query } from "@angular/animations";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  getClientList(query = null) {
    var url =
      query !== null
        ? `${environment.baseUrl}/users/list?query=${query}`
        : `${environment.baseUrl}/users/list`;

    return this.http.get(url, this.authService.getAuthHeaders());
  }

  createQRCode(orderId, data) {
    return this.http.post(
      `${environment.baseUrl}/create_qr_code/${orderId}`,
      data,
      this.authService.getAuthHeaders()
    );
  }

  getLabelData(orderId) {
    return this.http.get(
      `${environment.baseUrl}/orders/${orderId}/get-labels`,
      this.authService.getAuthHeaders()
    );
  }

  getOrderDetails(id, code = null) {
    let url =
      code !== null
        ? `${environment.baseUrl}/orders/${id}?code=${code}`
        : `${environment.baseUrl}/orders/${id}`;
    return this.http.get(url, this.authService.getAuthHeaders());
  }

  getAllOrdersCalendar(queryString?) {
    let url = queryString
      ? `${environment.baseUrl}/orders/list${queryString}`
      : `${environment.baseUrl}/orders/list`;
    return this.http.get(url, this.authService.getAuthHeaders());
  }

  getAllOrders(queryString?: string) {
    queryString = queryString?.replace(/^\?\?/, "?");

    if (!/^\?/.test(queryString)) {
      queryString = "?" + queryString;
    }

    let url = queryString
      ? `${environment.baseUrl}/v2/orders/list${queryString}`
      : `${environment.baseUrl}/v2/orders/list`;
    return this.http.get(url, this.authService.getAuthHeaders());
  }

  getAllProductionOrders() {
    return this.http.get(
      `${environment.baseUrl}/production/orders/list`,
      this.authService.getAuthHeaders()
    );
  }

  getAllClientOpenOrders() {
    return this.http.get(
      `${environment.baseUrl}/customer/orders/production`,
      this.authService.getAuthHeaders()
    );
  }

  getAllClientCompletedOrders() {
    return this.http.get(
      `${environment.baseUrl}/customer/orders/completed`,
      this.authService.getAuthHeaders()
    );
  }

  getAllSalesOrders() {
    return this.http.get(
      `${environment.baseUrl}/sales/orders/list`,
      this.authService.getAuthHeaders()
    );
  }

  updateShipping(orderid, extras?) {
    return this.http.get(
      `${environment.baseUrl}/admin/orders/${orderid}/shipping?sms=${extras?.sms}`,
      this.authService.getAuthHeaders()
    );
  }

  deleteSingleOrder(id) {
    return this.http.get(
      `${environment.baseUrl}/orders/${id}/delete`,
      this.authService.getAuthHeaders()
    );
  }

  deleteArtImage(id, order_id) {
    return this.http.get(
      `${environment.baseUrl}/orders/${order_id}/file/${id}`,
      this.authService.getAuthHeaders()
    );
  }

  deleteClientSingleOrder(id) {
    return this.http.get(
      `${environment.baseUrl}/customer/orders/${id}/delete`,
      this.authService.getAuthHeaders()
    );
  }

  updateOrder(id, orderObj) {
    return this.http.post(
      `${environment.baseUrl}/orders/${id}/update`,
      orderObj,
      this.authService.getAuthHeaders()
    );
  }

  createOrder(orderObj) {
    return this.http.post(
      `${environment.baseUrl}/order`,
      orderObj,
      this.authService.getAuthHeaders()
    );
  }

  updateOrderStatus(orderId, orderObj) {
    console.log(`${environment.baseUrl}/admin/orders/${orderId}/status`);
    return this.http.post(
      `${environment.baseUrl}/admin/orders/${orderId}/status`,
      orderObj,
      this.authService.getAuthHeaders()
    );
  }

  getAllPrinters() {
    return this.http.get(
      `${environment.baseUrl}/admin/printers/list`,
      this.authService.getAuthHeaders()
    );
  }

  getAllSalesReps() {
    return this.http.get(
      `${environment.baseUrl}/sales/list`,
      this.authService.getAuthHeaders()
    );
  }

  createIssue(orderID) {
    return this.http.get(
      `${environment.baseUrl}/admin/orders/${orderID}/issue`,
      this.authService.getAuthHeaders()
    );
  }

  createEvent(eventObj) {
    return this.http.post(
      `${environment.baseUrl}/events`,
      eventObj,
      this.authService.getAuthHeaders()
    );
  }

  getAllEvents() {
    return this.http.get(
      `${environment.baseUrl}/events`,
      this.authService.getAuthHeaders()
    );
  }

  deleteEvent(id) {
    return this.http.get(
      `${environment.baseUrl}/events/${id}/delete`,
      this.authService.getAuthHeaders()
    );
  }

  assignPrinter(orderId, printingObj) {
    return this.http.post(
      `${environment.baseUrl}/admin/orders/${orderId}/assign-printer`,
      printingObj,
      this.authService.getAuthHeaders()
    );
  }

  // printer

  createPrinter(printerObj) {
    return this.http.post(
      `${environment.baseUrl}/admin/printers/create`,
      printerObj,
      this.authService.getAuthHeaders()
    );
  }

  updatePrinter(id, printerObj) {
    return this.http.post(
      `${environment.baseUrl}/admin/printers/${id}/update`,
      printerObj,
      this.authService.getAuthHeaders()
    );
  }

  deletePrinter(id) {
    return this.http.get(
      `${environment.baseUrl}/admin/printers/${id}/delete`,
      this.authService.getAuthHeaders()
    );
  }

  // resources
  getAllResources() {
    return this.http.get(
      `${environment.baseUrl}/admin/resources/list`,
      this.authService.getAuthHeaders()
    );
  }

  createResource(printerObj) {
    return this.http.post(
      `${environment.baseUrl}/admin/resources/create`,
      printerObj,
      this.authService.getAuthHeaders()
    );
  }

  updateResource(id, printerObj) {
    return this.http.post(
      `${environment.baseUrl}/admin/resources/${id}/update`,
      printerObj,
      this.authService.getAuthHeaders()
    );
  }

  deleteResource(id) {
    return this.http.get(
      `${environment.baseUrl}/admin/resources/${id}/delete`,
      this.authService.getAuthHeaders()
    );
  }

  // upload film file
  uploadFilmFile(orderID, orderObj) {
    return this.http.post(
      `${environment.baseUrl}/orders/${orderID}/upload-film`,
      orderObj,
      this.authService.getAuthHeaders()
    );
  }

  // shipstation
  getAllSSCarriers() {
    return this.http.get(
      `${environment.baseUrl}/carriers`,
      this.authService.getAuthHeaders()
    );
  }
  getAllSSPackages(carrier_code) {
    return this.http.get(
      `${environment.baseUrl}/packages/${carrier_code}`,
      this.authService.getAuthHeaders()
    );
  }
  createLabel(orderId, labelObj) {
    return this.http.post(
      `${environment.baseUrl}/generate_label/${orderId}`,
      labelObj,
      this.authService.getAuthHeaders()
    );
  }
}
