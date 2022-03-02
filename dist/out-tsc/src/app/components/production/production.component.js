import { __decorate } from "tslib";
import { Component } from "@angular/core";
let ProductionComponent = /** @class */ (() => {
    let ProductionComponent = class ProductionComponent {
        constructor(orderService, router) {
            this.orderService = orderService;
            this.router = router;
            this.orderList = [];
            this.printers = [];
            this.search = "";
            this.search_customer = "";
            this.search_printDate = "";
            this.search_dateOrder = "";
            this.search_orderStatus = "";
            this.search_printer = "";
            this.search_orderType = "";
            this.selectedOrderId = "";
            this.selectedOrderArrivalDate = "";
            this.isLoading = false;
        }
        ngOnInit() {
            $("#select2").select2();
            $("#select3").select2();
            $("#select4").select2();
            $("#select5").select2();
            $("#select6").select2();
            $("#select7").select2();
            // $("#myTable").DataTable();
            $(".open-menu").click(function () {
                $(".dash-head-user").addClass("active");
            });
            $(".close-menu").click(function () {
                $(".dash-head-user").removeClass("active");
            });
            this.getAllProductionOrders();
            // this.getAllOrders();
            this.getAllPrinters();
            // this.getAllCustomers();
            $("#search_printDate").datepicker();
            $("#search_printDate").on("change", (event) => { this.handleDateChange(event); });
        }
        handleSearch() {
            let queryString = "";
            if (this.search) {
                queryString += `title=${this.search}&`;
            }
            if (this.search_customer) {
                queryString += `customer_id=${this.search_customer}&`;
            }
            if (this.search_printDate) {
                queryString += `print_date=${this.getSQLDate(this.search_printDate)}&`;
            }
            if (this.search_printer) {
                queryString += `printer_id=${this.search_printer}&`;
            }
            if (this.search_orderStatus) {
                queryString += `order_status=${this.search_orderStatus}&`;
            }
            if (this.search_orderType) {
                queryString += `order_type=${this.search_orderType}&`;
            }
            if (this.search_dateOrder) {
                queryString += `date_order=${this.search_dateOrder}&`;
            }
            if (queryString.length > 0) {
                queryString = "?" + queryString;
                this.getAllProductionOrders(queryString);
            }
        }
        handleDateChange(e) {
            console.log(e.target.id, e.target.value);
            let _val = this.getSQLDate(e.target.value);
            if (e.target.id == "search_printDate") {
                this.search_printDate = e.target.value;
            }
            $("#" + e.target.id).val(_val);
        }
        getSQLDate(str) {
            let date = new Date(str);
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let dateString = `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
            return dateString;
        }
        getAllPrinters() {
            this.orderService.getAllPrinters().subscribe((data) => {
                console.log(data);
                this.printers = data.data;
            }, (err) => { });
        }
        getAllProductionOrders(query) {
            this.isLoading = true;
            if (query) {
                this.orderService.getAllOrders(query).subscribe((data) => {
                    this.isLoading = false;
                    this.orderList = data.data;
                    console.log(this.orderList);
                    setTimeout(() => {
                        $("#myTable").DataTable({
                            order: [[4, "desc"]],
                            aoColumnDefs: [
                                {
                                    bSortable: false,
                                    aTargets: [6, 7, 8],
                                },
                            ],
                        });
                    }, 0);
                }, (err) => {
                    this.isLoading = false;
                    console.log(err);
                });
            }
            else {
                this.orderService.getAllOrders().subscribe((data) => {
                    this.isLoading = false;
                    this.orderList = data.data;
                    console.log(this.orderList);
                    setTimeout(() => {
                        $("#myTable").DataTable({
                            order: [[4, "desc"]],
                            aoColumnDefs: [
                                {
                                    bSortable: false,
                                    aTargets: [6, 7, 8],
                                },
                            ],
                        });
                    }, 0);
                }, (err) => {
                    this.isLoading = false;
                    console.log(err);
                });
            }
        }
        handleAction(cat, id) {
            switch (cat) {
                case "view":
                    this.router.navigate(["/order-details"], { queryParams: { id: id } });
                    break;
                case "edit":
                    this.router.navigate(["/add-order"], { queryParams: { id: id } });
                    break;
                default:
                    break;
            }
        }
        updateOrderStatus(id, field) {
            console.log(`${field}_${id}`);
            console.log($("#" + `${field}_${id}`).val());
            let formData = new FormData();
            formData.append(field, $("#" + `${field}_${id}`).val());
            // this.isLoading = true;
            this.orderService.updateOrderStatus(id, formData).subscribe((data) => {
                console.log(data);
                this.getAllProductionOrders();
            }, (err) => {
                // this.isLoading = false;
                console.log(err);
            });
        }
    };
    ProductionComponent = __decorate([
        Component({
            selector: "app-production",
            templateUrl: "./production.component.html",
            styleUrls: ["./production.component.css"],
        })
    ], ProductionComponent);
    return ProductionComponent;
})();
export { ProductionComponent };
//# sourceMappingURL=production.component.js.map