import { query } from "@angular/animations";
import { Location } from "@angular/common";
import { typeWithParameters } from "@angular/compiler/src/render3/util";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { merge } from "jquery";
import { AuthService } from "src/app/services/auth.service";
import { OrderService } from "src/app/services/order.service";
import { LoggerService, MessageType } from "src/app/services/logger.service";
import { UtilService } from "src/app/services/util.service";
import { environment } from "../../../environments/environment";
declare var $: any;

@Component({
  selector: "app-artwork",
  templateUrl: "./artwork.component.html",
  styleUrls: ["./artwork.component.css"],
})
export class ArtworkComponent implements OnInit {
  orders = [];
  user: any = {};
  fullData = {
    current_page: 0,
    last_page: 0,
    total: 0
  };
  printers = [];
  resources = [];
  salesReps = [];
  customers = [];
  checkboxes = [];
  search = "";
  search_customer = "";
  search_printDate = "";
  search_dateOrder = "";
  search_orderStatus = "";
  search_salesRep = "";
  search_printer = "";
  search_page = "";
  search_orderType = "";
  search_filmStatus = "";
  selectedOrderId = "";
  selectedOrderArrivalDate = "";
  qrIDString = "id";
  qrURLString = "url";
  timeout;
  isLoading = false;

  form = this.fb.group({
    order_id: [""],
    arrival_date: [""],
    printer_id: ["", Validators.required],
    resource_id: [""],
    print_date: ["", Validators.required],
    printer_schedule: ["", Validators.required],
    printer_duration: ["", Validators.required],
  });
  pagination = {
    current_page: 0,
    last_page: 0,
    total: 0,
  };

  newDateTimestamp = new Date().getTime();
  environment = {};

  constructor(
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private notifier: NotifierService,
    private loggerService: LoggerService,
    private utilService: UtilService
  ) {
    this.user = this.authService.getLocalUser();
  }

  ngOnInit(): void {
    $("#select2").select2();
    $("#select3").select2();
    $("#select4").select2();
    $("#select5").select2();
    $("#select6").select2();
    $("#select7").select2();

    setTimeout(() => {
      this.getAllPrinters();
      this.getAllCustomers();
      this.getAllSalesRep();
      this.getAllResources();
    }, 0);

    this.environment = environment;

    $("#datepicker_arrival_date").datepicker();
    $("#datepicker_print_date").datepicker();
    $("#search_printDate").datepicker();

    $("#datepicker_arrival_date,#datepicker_print_date,#search_printDate").on(
      "change",
      (event) => {
        this.handleDateChange(event);
      }
    );

    this.route.queryParams.subscribe((data) => {
      if (Object.keys(data).length) {

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

        if (obj["film_status"]) {
          this.search_filmStatus = obj["film_status"];
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

        if (obj["sale_id"]) {
          this.search_salesRep = obj["sale_id"];
        }

        if (obj["order_type"]) {
          this.search_orderType = obj["order_type"];
        }

        if (obj["order_type"]) {
          this.search_orderType = obj["order_type"];
        }

        if (obj["date_order"]) {
          this.search_dateOrder = obj["date_order"];
        }

        if (obj["page"]) {
          this.search_page = obj["page"];
        }

        qs = "?" + qs;
        this.getAllOrders(qs);
      } else {
        if (this.user.role == "Admin") {
          // this.search_orderStatus = "Processing";
          this.search_filmStatus = "not_added";
          this.handleSearch();
        } else {
          this.getAllOrders();
        }
      }
    });
  }

  openModal(id: any, arrivalDate: any) {
    this.selectedOrderId = id;
    this.selectedOrderArrivalDate = arrivalDate;
    this.form.controls.order_id.setValue(this.selectedOrderId);
    this.form.controls.arrival_date.setValue(this.selectedOrderArrivalDate);
    $("#assignPrinterDialog").modal("show");
  }

  openQRModal(id: any) {
    this.qrIDString = `${environment.baseFEUrl}/administrator?title=${id}`;
    this.qrURLString = `${environment.baseFEUrl}/order-details?id=${id}`;
    $("#qrCodeDialog").modal("show");
  }

  handleSearch(_timeout?: any) {
    if (_timeout) {
      let queryString = "";
      if (this.search) {
        queryString += `title=${this.search}&`;
      }
      if (this.search_customer) {
        queryString += `customer_id=${this.search_customer}&`;
      }
      if (this.search_filmStatus) {
        queryString += `film_status=${this.search_filmStatus}&`;
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
      if (this.search_salesRep) {
        queryString += `sale_id=${this.search_salesRep}&`;
      }
      if (this.search_orderType) {
        queryString += `order_type=${this.search_orderType}&`;
      }
      if (this.search_dateOrder) {
        queryString += `date_order=${this.search_dateOrder}&`;
      }
      if (this.search_page) {
        queryString += `page=${this.search_page}&`;
      }
      if (queryString.length > 0) {
        queryString = "?" + queryString;

        this.getAllOrders(queryString);
        this.location.go(this.router.url.split("?")[0], queryString);
      } else {
        this.location.go(this.router.url.split("?")[0], "");
        this.getAllOrders();
      }
      setTimeout(() => {
        this.search = "";
      }, 500);
    } else {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let queryString = "";
        if (this.search) {
          queryString += `title=${this.search}&`;
        }
        if (this.search_customer) {
          queryString += `customer_id=${this.search_customer}&`;
        }
        if (this.search_filmStatus) {
          queryString += `film_status=${this.search_filmStatus}&`;
        }
        if (this.search_printDate) {
          queryString += `print_date=${this.getSQLDate(
            this.search_printDate
          )}&`;
        }
        if (this.search_printer) {
          queryString += `printer_id=${this.search_printer}&`;
        }
        if (this.search_orderStatus) {
          queryString += `order_status=${this.search_orderStatus}&`;
        }
        if (this.search_salesRep) {
          queryString += `sale_id=${this.search_salesRep}&`;
        }
        if (this.search_orderType) {
          queryString += `order_type=${this.search_orderType}&`;
        }
        if (this.search_dateOrder) {
          queryString += `date_order=${this.search_dateOrder}&`;
        }
        if (this.search_page) {
          queryString += `page=${this.search_page}&`;
        }
        if (queryString.length > 0) {
          queryString = "?" + queryString;
          this.getAllOrders(queryString);
          this.location.go(this.router.url.split("?")[0], queryString);
        } else {
          this.location.go(this.router.url.split("?")[0], "");
          this.getAllOrders();
        }
        clearTimeout(this.timeout);
        setTimeout(() => {
          this.search = "";
        }, 500);
      }, 500);
    }
  }

  assignPrinter() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      let formData = new FormData();
      Object.keys(this.form.controls).forEach((control) => {
        formData.append(control, this.form.controls[control].value);
      });
      this.orderService.assignPrinter(this.selectedOrderId, formData).subscribe(
        (data: any) => {
          if (data.code == 200) {
            this.form.reset();
            $("#assignPrinterDialog").modal("hide");
            this.handleSearch(0);
          } else {
            alert(data.message);
            return false;
          }
        },
        (error) => {
          this.loggerService.write(error, MessageType.Error);
        }
      );
    }
  }

  getAllCustomers() {
    this.orderService.getClientList().subscribe(
      (data: any) => {
        this.customers = data.data;
      },
      (error) => {
        this.loggerService.write(error, MessageType.Error);
      }
    );
  }

  getAllOrders(queryString?: any) {
    this.isLoading = true;
    if (queryString) {
      queryString += "&type=artwork";
      this.orderService.getAllOrders(queryString).subscribe(
        (data: any) => {
          this.fullData = data;
          this.isLoading = false;
          this.orders = data.data;

          for(var j in this.orders){

            this.orders[j].proof_url = !/^http/.test(this.orders[j].proof_url) && typeof this.orders[j].proof_url === 'string' ?

              environment.awsURL + this.orders[j].proof_url
              :
              this.orders[j].proof_url
              ;

              this.orders[j].file_url = !/^http/.test(this.orders[j].file_url) && typeof this.orders[j].file_url === 'string' ?

              environment.awsURL + this.orders[j].file_url
              :
              this.orders[j].file_url
              ;

              this.orders[j].film_file = !/^http/.test(this.orders[j].film_file) && typeof this.orders[j].film_file === 'string' ?

              environment.awsURL + this.orders[j].film_file
              :
              this.orders[j].film_file
              ;


              for(var k in this.orders[j].order_arts){

                this.orders[j].order_arts[k].file_url = !/^http/.test(this.orders[j].order_arts[k].file_url) && typeof this.orders[j].order_arts[k].file_url === 'string' ?

                  environment.awsURL + this.orders[j].order_arts[k].file_url
                  :
                  this.orders[j].order_arts[k].file_url
                  ;

            }

          }


          this.pagination.current_page = data.current_page;
          this.pagination.last_page = data.last_page;
          this.pagination.total = data.total;

          setTimeout(() => {
            $("#myTable").DataTable({
              destroy: true,
              ordering: false,
              paging:false,
              info: false,
              aoColumnDefs: [
                {
                  bSortable: false,
                  aTargets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                },
              ],
            });
          }, 0);
        },
        (error) => {
          this.isLoading = false;
          this.loggerService.write(error, MessageType.Error);
        }
      );
    } else {
      this.orderService.getAllOrders("type=artwork").subscribe(
        (data: any) => {
          this.isLoading = false;
          this.orders = data.data;
          this.fullData = data;

          for(var j in this.orders){
            this.orders[j].proof_url = !/^http/.test(this.orders[j].proof_url) && typeof this.orders[j].proof_url === 'string' ?

              environment.awsURL + this.orders[j].proof_url
              :
              this.orders[j].proof_url
              ;


          }

          this.pagination.current_page = data.current_page;
          this.pagination.last_page = data.last_page;
          this.pagination.total = data.total;

          setTimeout(() => {
            $("#myTable").DataTable({
              ordering: false,
              paging:false,
              aoColumnDefs: [
                {
                  bSortable: false,
                  aTargets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                },
              ],
            });
          }, 0);
        },
        (error) => {
          this.isLoading = false;
          this.loggerService.write(error, MessageType.Error);
        }
      );
    }
  }

  handleAction(id: any, action: any) {
    switch (action) {
      case "view":
        return false;
        this.router.navigate(["/order-details"], { queryParams: { id: id } });
        break;
      case "edit":
        this.openCreateOrderModal(id);
        break;
      case "delete":
        confirm("Are you sure?") == true ? this.deleteOrder(id) : null;
        break;
      case "id_qr_code":
        this.openQRModal(id);
        break;
      default:
        break;
    }
  }

  deleteOrder(id: any) {
    this.orderService.deleteSingleOrder(id).subscribe(
      (data: any) => {
        if (data.code == 200) {
          this.getAllOrders();
        }
      },
      (error) => {
        this.loggerService.write(error, MessageType.Error);
      }
    );
  }

  getAllPrinters() {
    this.orderService.getAllPrinters().subscribe(
      (data: any) => {
        this.printers = data.data;
      },
      (error) => {
        this.loggerService.write(error, MessageType.Error);
      }
    );
  }

  getAllResources() {
    this.orderService.getAllResources().subscribe(
      (data: any) => {
        this.resources = data.data;
      },
      (error) => {
        this.loggerService.write(error, MessageType.Error);
      }
    );
  }

  getAllSalesRep() {
    this.orderService.getAllSalesReps().subscribe(
      (data: any) => {
        this.salesReps = data.data;
      },
      (error) => {
        this.loggerService.write(error, MessageType.Error);
      }
    );
  }

  handleCheckbox(e: any, id: any, field: any) {
    $("#" + `${field}_${id}`).val(e.target.checked);
    this.updateOrderStatus(id, field);
  }

  updateOrderStatus(id: any, field: any, status?: any) {
    let formData = new FormData();
    formData.append(field, $("#" + `${field}_${id}`).val());

    if (field.indexOf("production") > -1 && status == "Processing") {
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
            this.orderService.updateOrderStatus(id, formData).subscribe(
              (data: any) => {
                this.isLoading = false;
                if (data.code == 400) {
                  alert(data.message);
                } else {
                  this.handleSearch(0);
                }
              },
              (error) => {
                this.isLoading = false;
                this.loggerService.write(error, MessageType.Error);
              }
            );
          },
          No: () => {
            $(".ui-dialog-content").dialog("close");
            this.isLoading = false;
            this.orderService.updateOrderStatus(id, formData).subscribe(
              (data: any) => {
                this.isLoading = false;
                if (data.code == 400) {
                  alert(data.message);
                } else {
                  this.handleSearch(0);
                }
              },
              (error) => {
                this.isLoading = false;
                this.loggerService.write(error, MessageType.Error);
              }
            );
          },
        },
      });
      return;
    }

    if (field.indexOf("completed") > -1) {
      // user marked it as completed
      console.log("production to completed");

      // user pressed completed
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
            console.log("sending sms");
            this.isLoading = false;
            this.orderService.updateOrderStatus(id, formData).subscribe(
              (data: any) => {
                console.log(data);
                this.isLoading = false;
                console.log("internal method");

                if (data.code == 400) {
                  alert(data.message);
                } else {
                  this.handleSearch(0);
                }
                // this.getAllOrders();
              },
              (err) => {
                this.isLoading = false;
                console.log(err);
              }
            );
          },
          No: () => {
            $(".ui-dialog-content").dialog("close");
            this.isLoading = false;
            this.orderService.updateOrderStatus(id, formData).subscribe(
              (data: any) => {
                this.isLoading = false;
                console.log("internal method");

                if (data.code == 400) {
                  alert(data.message);
                } else {
                  this.handleSearch(0);
                }
                // this.getAllOrders();
              },
              (err) => {
                this.isLoading = false;
                console.log(err);
              }
            );
          },
        },
      });
      return;
    }

    this.isLoading = false;
    this.orderService.updateOrderStatus(id, formData).subscribe(
      (data: any) => {
        this.isLoading = false;
        console.log(data);

        if (data.code == 400) {
          alert(data.message);
        } else {
          // this.handleSearch(0);
        }
        // this.getAllOrders();
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  getSQLDate(str: any) {
    let date = new Date(str);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let dateString = `${date.getFullYear()}-${
      month < 10 ? "0" + month : month
    }-${day < 10 ? "0" + day : day}`;
    return dateString;
  }

  handleDateChange(e: any) {
    let _val = this.getSQLDate(e.target.value);
    if (e.target.id == "search_printDate") {
      this.search_printDate = e.target.value;
      this.handleSearch();
    }
    $("#" + e.target.id).val(_val);
    if (e.target.id == "datepicker_arrival_date") {
      this.form.controls.arrival_date.setValue(_val);
    } else if (e.target.id == "datepicker_print_date") {
      this.form.controls.print_date.setValue(_val);
    }
  }

  sendIssue(id: any) {
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
          this.orderService.createIssue(id).subscribe((data: any) => {
            $(".ui-dialog-content").dialog("close");
            alert(data.message);
          });
        },
        No: () => {
          $(".ui-dialog-content").dialog("close");
        },
      },
    });
  }

  updateShipping(id: any) {
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
          this.isLoading = true;
          this.orderService.updateShipping(id, { sms: "true" }).subscribe(
            (data: any) => {
              this.isLoading = false;
              $(".ui-dialog-content").dialog("close");
              if (data.code == 200) {
                this.getAllOrders();
              } else if (data.code == 400) {
                alert(data.message);
              }
            },
            (error) => {
              this.isLoading = false;
              this.loggerService.write(error, MessageType.Error);
            }
          );
        },
        No: () => {
          $(".ui-dialog-content").dialog("close");
          this.isLoading = true;
          this.orderService.updateShipping(id).subscribe(
            (data: any) => {
              this.isLoading = false;
              if (data.code == 200) {
                this.getAllOrders();
              } else if (data.code == 400) {
                alert(data.message);
              }
            },
            (error) => {
              this.isLoading = false;
              this.loggerService.write(error, MessageType.Error);
            }
          );
        },
      },
    });
  }

  clearFilters() {
    $("#dialog-content").text(
      "This will clear all the filters and refresh the page, are you sure?"
    );
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
  }

  handleCheckboxChange(e: any) {
    if (e.target.checked) {
      if (!this.checkboxes.includes(e.target.value)) {
        this.checkboxes.push(e.target.value);
      }
    } else {
      if (this.checkboxes.includes(e.target.value)) {
        this.checkboxes.splice(this.checkboxes.indexOf(e.target.value), 1);
      }
    }
  }

  viewMultipleOrders() {
    if (this.checkboxes.length > 0) {
      this.router.navigate(["/order-details"], {
        queryParams: { id: this.checkboxes.toString() },
      });
    }
  }

  async handleFilmFileUpload(event: any, id: any) {
    let formData = new FormData();
    formData.append("film_file", event.target.files[0]);

    try {
      this.notifier.notify("info", "Upload started");
      await this.orderService.uploadFilmFile(id, formData).toPromise();
      this.notifier.notify("success", "Upload Finished");
      this.handleSearch();
    } catch (error) {
      this.notifier.notify("error", error.message);
      this.loggerService.write(error, MessageType.Error);
    }
  }

  handlePageChangeClick(type: any){
    if(type=='previous'){
      this.pagination.current_page -= 1;
      this.search_page = this.pagination.current_page + "";
      this.handleSearch();
    }
    if(type == 'next'){
      this.pagination.current_page += 1;
      this.search_page = this.pagination.current_page+"";
      this.handleSearch();
    }
  }

  getArrivalType(type: string) {
    return this.utilService.getArrivalType(type);
  }

  getDifferenceInDays(date: any) {
    return this.utilService.calculateDiffInDays(date);
  }

  getDueInfo(date: any) {
    const diff = this.getDifferenceInDays(date);
    if(diff === -1)
      return 'Today';
    return (diff < 0) ? `Due ${Math.abs(diff)-1} days ago`: `Due in ${Math.abs(diff)+1} days`;
  }

  openCreateOrderModal(id = null) {
    var idClause = (id !== null) ? "&id="+id : "";
    $('#createOrderDialog').modal('show');
    $('#createOrderDialog').find("h5").text(id === null ? "Create New Order" : "Editing Order");
    $('#createOrderDialog').find('iframe')[0].src = environment.baseFEUrl+"/add-order?view=modal"+idClause
  }
}
