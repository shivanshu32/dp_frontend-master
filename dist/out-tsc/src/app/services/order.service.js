import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let OrderService = /** @class */ (() => {
    let OrderService = class OrderService {
        constructor(authService, http) {
            this.authService = authService;
            this.http = http;
        }
        getClientList() {
            return this.http.get(`${environment.baseUrl}/users/list`, this.authService.getAuthHeaders());
        }
        getOrderDetails(id) {
            return this.http.get(`${environment.baseUrl}/orders/${id}`, this.authService.getAuthHeaders());
        }
        getAllOrders(queryString) {
            let url = queryString
                ? `${environment.baseUrl}/orders/list${queryString}`
                : `${environment.baseUrl}/orders/list`;
            return this.http.get(url, this.authService.getAuthHeaders());
        }
        getAllProductionOrders() {
            return this.http.get(`${environment.baseUrl}/production/orders/list`, this.authService.getAuthHeaders());
        }
        getAllClientOpenOrders() {
            return this.http.get(`${environment.baseUrl}/customer/orders/production`, this.authService.getAuthHeaders());
        }
        getAllClientCompletedOrders() {
            return this.http.get(`${environment.baseUrl}/customer/orders/completed`, this.authService.getAuthHeaders());
        }
        getAllSalesOrders() {
            return this.http.get(`${environment.baseUrl}/sales/orders/list`, this.authService.getAuthHeaders());
        }
        updateShipping(orderid) {
            return this.http.get(`${environment.baseUrl}/admin/orders/${orderid}/shipping`, this.authService.getAuthHeaders());
        }
        deleteSingleOrder(id) {
            return this.http.get(`${environment.baseUrl}/orders/${id}/delete`, this.authService.getAuthHeaders());
        }
        deleteArtImage(id, order_id) {
            return this.http.get(`${environment.baseUrl}/orders/${order_id}/file/${id}`, this.authService.getAuthHeaders());
        }
        deleteClientSingleOrder(id) {
            return this.http.get(`${environment.baseUrl}/customer/orders/${id}/delete`, this.authService.getAuthHeaders());
        }
        updateOrder(id, orderObj) {
            return this.http.post(`${environment.baseUrl}/orders/${id}/update`, orderObj, this.authService.getAuthHeaders());
        }
        createOrder(orderObj) {
            return this.http.post(`${environment.baseUrl}/order`, orderObj, this.authService.getAuthHeaders());
        }
        updateOrderStatus(orderId, orderObj) {
            console.log(`${environment.baseUrl}/admin/orders/${orderId}/status`);
            return this.http.post(`${environment.baseUrl}/admin/orders/${orderId}/status`, orderObj, this.authService.getAuthHeaders());
        }
        getAllPrinters() {
            return this.http.get(`${environment.baseUrl}/admin/printers/list`, this.authService.getAuthHeaders());
        }
        createIssue(orderID) {
            return this.http.get(`${environment.baseUrl}/admin/orders/${orderID}/issue`, this.authService.getAuthHeaders());
        }
        assignPrinter(orderId, printingObj) {
            return this.http.post(`${environment.baseUrl}/admin/orders/${orderId}/assign-printer`, printingObj, this.authService.getAuthHeaders());
        }
        // printer
        createPrinter(printerObj) {
            return this.http.post(`${environment.baseUrl}/admin/printers/create`, printerObj, this.authService.getAuthHeaders());
        }
        updatePrinter(id, printerObj) {
            return this.http.post(`${environment.baseUrl}/admin/printers/${id}/update`, printerObj, this.authService.getAuthHeaders());
        }
        deletePrinter(id) {
            return this.http.get(`${environment.baseUrl}/admin/printers/${id}/delete`, this.authService.getAuthHeaders());
        }
    };
    OrderService = __decorate([
        Injectable({
            providedIn: "root",
        })
    ], OrderService);
    return OrderService;
})();
export { OrderService };
//# sourceMappingURL=order.service.js.map