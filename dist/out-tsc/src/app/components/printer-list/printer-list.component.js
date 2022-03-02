import { __decorate } from "tslib";
import { Component } from "@angular/core";
let PrinterListComponent = /** @class */ (() => {
    let PrinterListComponent = class PrinterListComponent {
        constructor(orderService, router, authService) {
            this.orderService = orderService;
            this.router = router;
            this.authService = authService;
            this.printers = [];
            this.user = {};
            this.title = "";
            this.showErr = false;
            this.printerID = 0;
            this.isLoading = false;
            this.isEditMode = false;
            this.user = this.authService.getLocalUser();
        }
        ngOnInit() {
            this.getAllPrinters();
        }
        getAllPrinters() {
            this.isLoading = true;
            this.orderService.getAllPrinters().subscribe((data) => {
                this.printers = data.data;
                console.log(data);
                this.isLoading = false;
                this.title = "";
                setTimeout(() => {
                    $("#myTable").DataTable({
                        order: [[1, "desc"]],
                        aoColumnDefs: [
                            {
                                bSortable: false,
                                aTargets: [2],
                            },
                        ],
                    });
                }, 0);
            }, (err) => {
                console.log(err);
                this.isLoading = false;
            });
        }
        addPrinter() {
            if (!this.title) {
                this.showErr = true;
                return false;
            }
            this.isLoading = true;
            let formData = new FormData();
            formData.append("title", this.title);
            if (this.isEditMode) {
                this.orderService.updatePrinter(this.printerID, formData).subscribe((data) => {
                    // close edit mode
                    console.log(data);
                    console.log(this.title);
                    this.title = "";
                    this.isEditMode = false;
                    this.isLoading = false;
                    this.getAllPrinters();
                }, (err) => {
                    this.isLoading = false;
                    console.log(err);
                });
            }
            else {
                // create new
                this.orderService.createPrinter(formData).subscribe((data) => {
                    console.log(data);
                    this.isLoading = false;
                    this.getAllPrinters();
                }, (err) => {
                    console.log(err);
                    this.isLoading = false;
                });
            }
        }
        handleAction(id, action) {
            switch (action) {
                case "edit":
                    this.printerID = id;
                    this.isEditMode = true;
                    this.title = this.printers.filter((printer) => printer.id == id)[0].title;
                    document.body.scrollTo(0, 0);
                    break;
                case "delete":
                    this.deletePrinter(id);
                    break;
            }
        }
        deletePrinter(id) {
            this.isLoading = true;
            this.orderService.deletePrinter(id).subscribe((data) => {
                this.isLoading = false;
                console.log(data);
                this.getAllPrinters();
            }, (err) => {
                this.isLoading = false;
                console.log(err);
            });
        }
    };
    PrinterListComponent = __decorate([
        Component({
            selector: "app-printer-list",
            templateUrl: "./printer-list.component.html",
            styleUrls: ["./printer-list.component.css"],
        })
    ], PrinterListComponent);
    return PrinterListComponent;
})();
export { PrinterListComponent };
//# sourceMappingURL=printer-list.component.js.map