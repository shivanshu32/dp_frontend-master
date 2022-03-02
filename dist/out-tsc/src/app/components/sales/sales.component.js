import { __decorate } from "tslib";
import { Component } from "@angular/core";
let SalesComponent = /** @class */ (() => {
    let SalesComponent = class SalesComponent {
        constructor(orderService, router, authService) {
            this.orderService = orderService;
            this.router = router;
            this.authService = authService;
            this.user = {};
            this.orders = [];
            this.customers = [];
            this.search = "";
            this.search_customer = "";
            this.search_printDate = "";
            this.search_dateOrder = "";
            this.search_orderStatus = "";
            this.search_printer = "";
            this.search_orderType = "";
            this.isLoading = false;
            this.user = this.authService.getLocalUser();
        }
        ngOnInit() {
            $("#select2").select2();
            $("#select3").select2();
            $("#select4").select2();
            $("#select5").select2();
            $("#select6").select2();
            $("#select7").select2();
            // $('#myTable').DataTable();
            $(".open-menu").click(function () {
                $(".dash-head-user").addClass("active");
            });
            $(".close-menu").click(function () {
                $(".dash-head-user").removeClass("active");
            });
            $("#search_printDate").datepicker();
            this.getAllOrders();
            this.getAllCustomers();
            $("#datepicker_arrival_date,#datepicker_print_date,#search_printDate").on("change", (event) => {
                this.handleDateChange(event);
            });
        }
        getAllOrders(queryString) {
            this.isLoading = true;
            if (queryString) {
                this.orderService.getAllOrders(queryString).subscribe((data) => {
                    this.isLoading = false;
                    console.log(data);
                    this.orders = data.data;
                    setTimeout(() => {
                        $("#myTable").DataTable({
                            order: [[5, "desc"]],
                            aoColumnDefs: [
                                {
                                    bSortable: false,
                                    aTargets: [2, 3, 4, 8, 9],
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
                    console.log(data);
                    this.orders = data.data;
                    setTimeout(() => {
                        $("#myTable").DataTable({
                            order: [[5, "desc"]],
                            aoColumnDefs: [
                                {
                                    bSortable: false,
                                    aTargets: [2, 3, 4, 8, 9],
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
                this.getAllOrders(queryString);
            }
        }
        getAllCustomers() {
            this.orderService.getClientList().subscribe((data) => {
                this.customers = data.data;
            }, (err) => {
                console.log(err);
            });
        }
        getSQLDate(str) {
            let date = new Date(str);
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let dateString = `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
            return dateString;
        }
        handleAction(id, action) {
            switch (action) {
                case "view":
                    this.router.navigate(["/order-details"], { queryParams: { id: id } });
                    break;
                case "edit":
                    this.router.navigate(["/add-order"], { queryParams: { id: id } });
                    break;
                case "delete":
                    confirm("Are you sure?") == true ? this.deleteOrder(id) : null;
                    break;
                default:
                    break;
            }
        }
        deleteOrder(id) {
            this.orderService.deleteSingleOrder(id).subscribe((data) => {
                if (data.code == 200) {
                    console.log(data);
                    this.getAllOrders();
                }
            }, (err) => {
                console.log(err);
            });
        }
        handleCheckbox(e, id, field) {
            console.log(e.target.checked);
            $("#" + `${field}_${id}`).val(e.target.checked);
            this.updateOrderStatus(id, field);
        }
        updateOrderStatus(id, field) {
            console.log(`${field}_${id}`);
            console.log($("#" + `${field}_${id}`).val());
            let formData = new FormData();
            formData.append(field, $("#" + `${field}_${id}`).val());
            this.isLoading = true;
            this.orderService.updateOrderStatus(id, formData).subscribe((data) => {
                this.isLoading = false;
                console.log(data);
                this.getAllOrders();
            }, (err) => {
                this.isLoading = false;
                console.log(err);
            });
        }
        handleDateChange(e) {
            console.log(e.target.id, e.target.value);
            let _val = this.getSQLDate(e.target.value);
            $("#" + e.target.id).val(_val);
            if (e.target.id == "search_printDate") {
                this.search_printDate = e.target.value;
            }
            // if (e.target.id == "datepicker_arrival_date") {
            //   this.form.controls.arrival_date.setValue(_val);
            // } else {
            //   this.form.controls.print_date.setValue(_val);
            // }
        }
    };
    SalesComponent = __decorate([
        Component({
            selector: "app-sales",
            templateUrl: "./sales.component.html",
            styleUrls: ["./sales.component.css"],
        })
    ], SalesComponent);
    return SalesComponent;
})();
export { SalesComponent };
//# sourceMappingURL=sales.component.js.map