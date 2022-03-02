import { __decorate } from "tslib";
import { Component } from "@angular/core";
import { Validators } from "@angular/forms";
let AdministratorComponent = /** @class */ (() => {
    let AdministratorComponent = class AdministratorComponent {
        constructor(orderService, router, authService, fb, route, location) {
            this.orderService = orderService;
            this.router = router;
            this.authService = authService;
            this.fb = fb;
            this.route = route;
            this.location = location;
            this.orders = [];
            this.user = {};
            this.printers = [];
            this.customers = [];
            this.search = "";
            this.search_customer = "";
            this.search_printDate = "";
            this.search_dateOrder = "";
            this.search_orderStatus = "";
            this.search_printer = "";
            this.search_orderType = "";
            this.selectedOrderId = "";
            this.selectedOrderArrivalDate = "";
            this.form = this.fb.group({
                order_id: [""],
                arrival_date: [""],
                printer_id: ["", Validators.required],
                print_date: ["", Validators.required],
                printer_schedule: ["", Validators.required],
                printer_duration: ["", Validators.required],
            });
            this.isLoading = false;
            this.checkboxes = [];
            this.user = this.authService.getLocalUser();
        }
        ngOnInit() {
            $("#select2").select2();
            $("#select3").select2();
            $("#select4").select2();
            $("#select5").select2();
            $("#select6").select2();
            $("#select7").select2();
            setTimeout(() => {
                this.getAllPrinters();
                this.getAllCustomers();
            }, 0);
            $("#datepicker_arrival_date").datepicker();
            $("#datepicker_print_date").datepicker();
            $("#search_printDate").datepicker();
            $("#datepicker_arrival_date,#datepicker_print_date,#search_printDate").on("change", (event) => {
                this.handleDateChange(event);
            });
            // console.log(this.user)
            // if(this.user.role == "Admin"){
            //   this.search_orderStatus = "Processing"
            // }
            this.route.queryParams.subscribe((data) => {
                if (Object.keys(data).length) {
                    console.log(data);
                    let qs = "";
                    Object.keys(data).forEach((item) => {
                        qs += `${item}=${data[item]}&`;
                    });
                    let obj = {};
                    let arr = qs.split("&");
                    arr.map((item) => {
                        obj["" + item.split("=")[0]] = item.split("=")[1];
                    });
                    if (obj["title"]) {
                        this.search = obj["title"];
                    }
                    if (obj["customer_id"]) {
                        this.search_customer = obj["customer_id"];
                    }
                    if (obj["print_date"]) {
                        this.search_printDate = obj["print_date"];
                    }
                    if (obj["printer_id"]) {
                        this.search_printer = obj["printer_id"];
                    }
                    if (obj["order_status"]) {
                        this.search_orderStatus = obj["order_status"];
                    }
                    if (obj["order_type"]) {
                        this.search_orderType = obj["order_type"];
                    }
                    if (obj["date_order"]) {
                        this.search_dateOrder = obj["date_order"];
                    }
                    qs = "?" + qs;
                    this.getAllOrders(qs);
                }
                else {
                    if (this.user.role == "Admin") {
                        this.search_orderStatus = "Processing";
                        this.handleSearch();
                    }
                    else {
                        this.getAllOrders();
                    }
                }
            });
        }
        openModal(id, arrivalDate) {
            this.selectedOrderId = id;
            this.selectedOrderArrivalDate = arrivalDate;
            this.form.controls.order_id.setValue(this.selectedOrderId);
            this.form.controls.arrival_date.setValue(this.selectedOrderArrivalDate);
            console.log(this.selectedOrderId);
            $("#assignPrinterDialog").modal("show");
        }
        handleSearch(_timeout) {
            if (_timeout) {
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
                    this.location.go(this.router.url.split("?")[0], queryString);
                }
                else {
                    this.location.go(this.router.url.split("?")[0], "");
                    this.getAllOrders();
                }
            }
            else {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
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
                        this.location.go(this.router.url.split("?")[0], queryString);
                    }
                    else {
                        this.location.go(this.router.url.split("?")[0], "");
                        this.getAllOrders();
                    }
                    clearTimeout(this.timeout);
                }, 500);
            }
        }
        assignPrinter() {
            if (this.form.invalid) {
                this.form.markAllAsTouched();
            }
            else {
                console.log(this.form.status);
                let formData = new FormData();
                Object.keys(this.form.controls).forEach((control) => {
                    formData.append(control, this.form.controls[control].value);
                });
                this.orderService.assignPrinter(this.selectedOrderId, formData).subscribe((data) => {
                    if (data.code == 200) {
                        console.log(data);
                        this.form.reset();
                        $("#assignPrinterDialog").modal("hide");
                        this.getAllOrders();
                    }
                    else {
                        alert(data.message);
                        return false;
                    }
                }, (err) => {
                    console.log(err);
                });
            }
        }
        getAllCustomers() {
            this.orderService.getClientList().subscribe((data) => {
                this.customers = data.data;
            }, (err) => {
                console.log(err);
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
                            destroy: true,
                            order: [[8, "desc"]],
                            aoColumnDefs: [
                                {
                                    bSortable: false,
                                    aTargets: [0, 1, 3, 4, 5, 6, 7, 13, 14, 15, 16],
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
                            order: [[8, "desc"]],
                            aoColumnDefs: [
                                {
                                    bSortable: false,
                                    aTargets: [0, 1, 3, 4, 5, 6, 7, 13, 14, 15, 16],
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
        getAllPrinters() {
            this.orderService.getAllPrinters().subscribe((data) => {
                console.log(data);
                this.printers = data.data;
            }, (err) => { });
        }
        handleCheckbox(e, id, field) {
            console.log(e.target.checked);
            $("#" + `${field}_${id}`).val(e.target.checked);
            this.updateOrderStatus(id, field);
        }
        updateOrderStatus(id, field, status) {
            console.log(`${field}_${id}`);
            console.log($("#" + `${field}_${id}`).val());
            let formData = new FormData();
            formData.append(field, $("#" + `${field}_${id}`).val());
            if (field.indexOf("production") > -1 && status == "Processing") {
                console.log("processing to production");
                // user pressed production
                $("#dialog-content").text("Send SMS?");
                $("#dialog-confirm").dialog({
                    resizable: false,
                    draggable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    position: { my: "center", at: "center", of: window },
                    buttons: {
                        Yes: () => {
                            $(".ui-dialog-content").dialog("close");
                            formData.append("sms", "true");
                            this.isLoading = false;
                            this.orderService.updateOrderStatus(id, formData).subscribe((data) => {
                                this.isLoading = false;
                                console.log("internal method");
                                if (data.code == 400) {
                                    alert(data.message);
                                }
                                else {
                                    this.handleSearch(0);
                                }
                                // this.getAllOrders();
                            }, (err) => {
                                this.isLoading = false;
                                console.log(err);
                            });
                        },
                        No: () => {
                            $(".ui-dialog-content").dialog("close");
                            this.isLoading = false;
                            this.orderService.updateOrderStatus(id, formData).subscribe((data) => {
                                this.isLoading = false;
                                console.log("internal method");
                                if (data.code == 400) {
                                    alert(data.message);
                                }
                                else {
                                    this.handleSearch(0);
                                }
                                // this.getAllOrders();
                            }, (err) => {
                                this.isLoading = false;
                                console.log(err);
                            });
                        },
                    },
                });
                return;
                // let ans = confirm("Send SMS?");
                // if(ans){
                //   formData.append("sms","true");
                // }
            }
            console.log("external method");
            this.isLoading = false;
            this.orderService.updateOrderStatus(id, formData).subscribe((data) => {
                this.isLoading = false;
                console.log(data);
                if (data.code == 400) {
                    alert(data.message);
                }
                else {
                    this.handleSearch(0);
                }
                // this.getAllOrders();
            }, (err) => {
                this.isLoading = false;
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
        handleDateChange(e) {
            console.log(e.target.id, e.target.value);
            let _val = this.getSQLDate(e.target.value);
            if (e.target.id == "search_printDate") {
                this.search_printDate = e.target.value;
                this.handleSearch();
            }
            $("#" + e.target.id).val(_val);
            if (e.target.id == "datepicker_arrival_date") {
                this.form.controls.arrival_date.setValue(_val);
            }
            else if (e.target.id == "datepicker_print_date") {
                this.form.controls.print_date.setValue(_val);
            }
        }
        sendIssue(id) {
            $("#dialog-content").text("An SMS will be sent, are you sure?");
            $("#dialog-confirm").dialog({
                resizable: false,
                draggable: false,
                height: "auto",
                width: 400,
                modal: true,
                position: { my: "center", at: "center", of: window },
                buttons: {
                    Yes: () => {
                        this.orderService.createIssue(id).subscribe((data) => {
                            $(".ui-dialog-content").dialog("close");
                            alert(data.message);
                            console.log(data);
                        });
                    },
                    No: () => {
                        $(".ui-dialog-content").dialog("close");
                    },
                },
            });
        }
        updateShipping(id) {
            this.isLoading = true;
            this.orderService.updateShipping(id).subscribe((data) => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.getAllOrders();
                }
                else if (data.code == 400) {
                    alert(data.message);
                }
            }, (err) => {
                console.log(err);
                this.isLoading = false;
            });
        }
        clearFilters() {
            $("#dialog-content").text("This will clear all the filters and refresh the page, are you sure?");
            $("#dialog-confirm").dialog({
                resizable: false,
                draggable: false,
                height: "auto",
                width: 400,
                modal: true,
                position: { my: "center", at: "center", of: window },
                buttons: {
                    Yes: () => {
                        $(".ui-dialog-content").dialog("close");
                        this.router.navigate(["/dashboard"]);
                    },
                    No: () => {
                        $(".ui-dialog-content").dialog("close");
                    },
                },
            });
            // if(confirm("This will clear all the filters and refresh the page. Are you sure?")){
            //   // this.search = "";
            //   // this.search_customer = "";
            //   // this.search_dateOrder = "";
            //   // this.search_orderStatus = "Processing";
            //   // this.search_orderType = "";
            //   // this.search_printDate = "";
            //   // this.search_printer = "";
            //   // this.location.go(this.router.url.split("?")[0], "");
            //   // this.getAllOrders();
            // }
        }
        handleCheckboxChange(e) {
            if (e.target.checked) {
                if (!this.checkboxes.includes(e.target.value)) {
                    this.checkboxes.push(e.target.value);
                }
            }
            else {
                if (this.checkboxes.includes(e.target.value)) {
                    this.checkboxes.splice(this.checkboxes.indexOf(e.target.value), 1);
                }
            }
            console.log(this.checkboxes.toString());
        }
        viewMultipleOrders() {
            if (this.checkboxes.length > 0) {
                this.router.navigate(["/order-details"], { queryParams: { id: this.checkboxes.toString() } });
            }
        }
    };
    AdministratorComponent = __decorate([
        Component({
            selector: "app-administrator",
            templateUrl: "./administrator.component.html",
            styleUrls: ["./administrator.component.css"],
        })
    ], AdministratorComponent);
    return AdministratorComponent;
})();
export { AdministratorComponent };
//# sourceMappingURL=administrator.component.js.map