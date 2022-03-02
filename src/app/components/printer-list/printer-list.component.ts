import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { OrderService } from "src/app/services/order.service";
declare var $: any;

@Component({
  selector: "app-printer-list",
  templateUrl: "./printer-list.component.html",
  styleUrls: ["./printer-list.component.css"],
})
export class PrinterListComponent implements OnInit {
  printers = [];
  user: any = {};
  title: string = "";
  showErr = false;
  printerID = 0;
  isLoading = false;
  isEditMode = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService
  ) {
    this.user = this.authService.getLocalUser();
  }

  ngOnInit(): void {
    this.getAllPrinters();
  }

  getAllPrinters() {
    this.isLoading = true;
    this.orderService.getAllPrinters().subscribe(
      (data: any) => {
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
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
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
      this.orderService.updatePrinter(this.printerID, formData).subscribe(
        (data: any) => {
          // close edit mode
          console.log(data);
          console.log(this.title);
          this.title = "";
          this.isEditMode = false;
          this.isLoading = false;
          this.getAllPrinters();
        },
        (err) => {
          this.isLoading = false;
          console.log(err);
        }
      );
    } else {
      // create new
      this.orderService.createPrinter(formData).subscribe(
        (data: any) => {
          console.log(data);
          this.isLoading = false;
          this.getAllPrinters();
        },
        (err) => {
          console.log(err);
          this.isLoading = false;
        }
      );
    }
  }

  handleAction(id, action) {
    switch (action) {
      case "edit":
        this.printerID = id;
        this.isEditMode = true;
        this.title = this.printers.filter(
          (printer) => printer.id == id
        )[0].title;
        document.body.scrollTo(0, 0);
        break;
      case "delete":
        this.deletePrinter(id);
        break;
    }
  }

  deletePrinter(id) {
    this.isLoading = true;
    this.orderService.deletePrinter(id).subscribe(
      (data: any) => {
        this.isLoading = false;
        console.log(data);
        this.getAllPrinters();
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }
}
