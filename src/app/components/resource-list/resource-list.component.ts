import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { AuthService } from "src/app/services/auth.service";
import { OrderService } from "src/app/services/order.service";
declare var $: any;

@Component({
  selector: "app-resource-list",
  templateUrl: "./resource-list.component.html",
  styleUrls: ["./resource-list.component.css"],
})
export class ResourceListComponent implements OnInit {
  printers = [];
  user: any = {};
  email: string = "";
  name: string = "";
  showErr = false;
  printerID = 0;
  isLoading = false;
  isEditMode = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService,
    private notifier:NotifierService
  ) {
    this.user = this.authService.getLocalUser();
  }

  ngOnInit(): void {
    this.getAllPrinters();
  }

  getAllPrinters() {
    this.isLoading = true;
    this.orderService.getAllResources().subscribe(
      (data: any) => {
        this.printers = data.data;
        console.log(data);
        this.isLoading = false;
        this.email = "";
        this.name = ""
        setTimeout(() => {
          $("#myTable").DataTable({
            order: [[2, "desc"]],
            aoColumnDefs: [
              {
                bSortable: false,
                aTargets: [2,3],
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
    if (!this.email || !this.name) {
      this.showErr = true;
      return false;
    }

    this.isLoading = true;
    let formData = new FormData();
    formData.append("email", this.email);
    formData.append("name", this.name);

    if (this.isEditMode) {
      this.orderService.updateResource(this.printerID, formData).subscribe(
        (data: any) => {
          // close edit mode
          console.log(data);
          console.log(this.email);
          this.email = "";
          this.name  = "";
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
      this.orderService.createResource(formData).subscribe(
        (data: any) => {
          console.log(data);
          if(data.code == 400){
            this.notifier.notify("error",data.message);
          }
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
        this.email = this.printers.filter(
          (printer) => printer.id == id
        )[0].email;
        this.name = this.printers.filter(
          (printer) => printer.id == id
        )[0].name; 
        document.body.scrollTo(0, 0);
        break;
      case "delete":
        this.deletePrinter(id);
        break;
    }
  }

  deletePrinter(id) {
    this.isLoading = true;
    this.orderService.deleteResource(id).subscribe(
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
