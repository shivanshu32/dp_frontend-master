import { __decorate } from "tslib";
import { Component } from "@angular/core";
let ClientordersComponent = /** @class */ (() => {
    let ClientordersComponent = class ClientordersComponent {
        constructor(orderService, router, route) {
            this.orderService = orderService;
            this.router = router;
            this.route = route;
            this.orderList = [];
            this.status = "";
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
            this.getData();
        }
        getData() {
            this.route.queryParams.subscribe((data) => {
                this.status = data.status;
                if (!this.status) {
                    this.router.navigate(["/login"]);
                    return false;
                }
                if (this.status === "open") {
                    // open orders
                    this.getAllOpenOrders();
                }
                else {
                    // completed orders
                    this.getAllCompletedOrders();
                }
            });
        }
        getAllOpenOrders() {
            this.orderService.getAllClientOpenOrders().subscribe((data) => {
                this.orderList = data.data;
                console.log(this.orderList);
                setTimeout(() => {
                    $("#myTable").DataTable({
                        destroy: true,
                        order: [[3, "desc"]],
                        aoColumnDefs: [
                            {
                                bSortable: false,
                                aTargets: [4, 5, 7],
                            },
                        ],
                    });
                }, 0);
            }, (err) => {
                console.log(err);
            });
        }
        getAllCompletedOrders() {
            this.orderService.getAllClientCompletedOrders().subscribe((data) => {
                this.orderList = data.data;
                console.log(this.orderList);
                setTimeout(() => {
                    $("#myTable").DataTable({
                        destroy: true,
                        order: [[3, "desc"]],
                        aoColumnDefs: [
                            {
                                bSortable: false,
                                aTargets: [4, 5, 7],
                            },
                        ],
                    });
                }, 0);
            }, (err) => {
                console.log(err);
            });
        }
        handleAction(cat, id) {
            switch (cat) {
                case "view":
                    this.router.navigate(["/order-details"], { queryParams: { id: id } });
                    break;
                case "edit":
                    this.router.navigate(["/add-order"], { queryParams: { id: id } });
                    break;
                case "delete":
                    this.deleteOrder(id);
                    break;
                default:
                    break;
            }
        }
        deleteOrder(id) {
            this.orderService.deleteClientSingleOrder(id).subscribe((data) => {
                console.log(data);
                if (data.code == 200) {
                    this.getData();
                }
                else {
                    alert(data.message);
                }
            }, err => {
            });
        }
    };
    ClientordersComponent = __decorate([
        Component({
            selector: "app-client-orders",
            templateUrl: "./client-orders.component.html",
            styleUrls: ["./client-orders.component.css"],
        })
    ], ClientordersComponent);
    return ClientordersComponent;
})();
export { ClientordersComponent };
//# sourceMappingURL=client-orders.component.js.map