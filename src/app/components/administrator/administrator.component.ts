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
import { UserService } from "src/app/services/user.service";
import { UtilService } from "src/app/services/util.service";
import { LoggerService, MessageType } from "src/app/services/logger.service";
import { environment } from "../../../environments/environment";
// import * as $ from 'jquery';
declare var $: any;

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: "app-administrator",
  templateUrl: "./administrator.component.html",
  styleUrls: ["./administrator.component.css"],
})
export class AdministratorComponent implements OnInit {
  orders = [];
  user: any = {};
  carriers: any = [];
  packages: any = [];
  services: any = [];
  environment = {};
  printers = [];
  fullData = {
    current_page: 0,
    last_page: 0,
    total: 0,
  };
  resources = [];
  salesReps = [];
  customers = [];
  search = "";
  search_customer = "";
  search_printDate = "";
  search_dateOrder = "";
  search_orderStatus = "";
  search_page = "";
  search_salesRep = "";
  search_printer = "";
  search_orderType = "";
  selectedOrderId = "";
  selectedOrderArrivalDate = "";

  qrIDString = "";
  qrURLString = "";
  qrURLShippingString = "";
  orderId = "";
  orderName = "";
  timeout;
  checkboxes = [];
  states = [];

  networkCall = false;
  activeOrderId;
  showLabel = false;
  label = "";
  isLoading = false;
  isCreatingAccountLoading = false;

  ship_type = "";
  notes = "";
  weight = "";
  boxes = "";

  form = this.fb.group({
    order_id: [""],
    arrival_date: [""],
    printer_id: ["", Validators.required],
    print_date: ["", Validators.required],
    printer_schedule: ["", Validators.required],
    printer_duration: ["", Validators.required],
  });

  formOutSide = this.fb.group({
    order_id: [""],
    resource_id: ["", Validators.required],
  });

  formCreateAccount = this.fb.group({
    role: ["", Validators.required],
    password: ["", Validators.required],
    first_name: ["", Validators.required],
    last_name: ["", Validators.required],
    company: [""],
    address: ["", Validators.required],
    street_appartment: [""],
    contact_number: ["", Validators.required],
    city: ["", Validators.required],
    state: ["", Validators.required],
    zipcode: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],

    shipping_name: ["", Validators.required],
    shipping_last_name: ["", Validators.required],
    shipping_company: [""],
    shipping_address: ["", Validators.required],
    shipping_street_appartment: [""],
    shipping_phone: ["", Validators.required],
    shipping_city: ["", Validators.required],
    shipping_state: ["", Validators.required],
    shipping_zipcode: ["", Validators.required],
    shipping_email: ["", Validators.email],
  });

  ssForm = this.fb.group({
    carriers_code: ["", Validators.required],
    weight_value: ["", Validators.required],
    service_code: ["", Validators.required],
    package_code: ["", Validators.required],
    package_length: ["", Validators.required],
    package_size: ["", Validators.required],
    package_width: ["", Validators.required],
    shipping_confirmation: ["none"],
  });

  pagination = {
    current_page: 0,
    last_page: 0,
    total: 0,
  };

  newDateTimestamp = new Date().getTime();

  constructor(
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private notifier: NotifierService,
    private userService: UserService,
    private utilService: UtilService,
    private loggerService: LoggerService
  ) {
    this.user = this.authService.getLocalUser();
    this.states = this.utilService.getStatesList();
  }

  async handleCarrierChange(event) {
    this.networkCall = true;
    let d = (
      await this.orderService.getAllSSPackages(event.target.value).toPromise()
    )["data"];
    this.packages = d.packages;
    this.services = d.services;
    this.networkCall = false;
  }

  ngOnInit() {
    window["angularScope"] = this;

    $("#select2").select2();
    $("#select3").select2();
    $("#select4").select2();
    $("#select5").select2();
    $("#select6").select2();
    $("#select7").select2();

    setTimeout(async () => {
      this.getAllPrinters();
      this.getAllCustomers();
      this.getAllSalesRep();
      this.getAllResources();
      this.carriers = (await this.orderService.getAllSSCarriers().toPromise())[
        "data"
      ];
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

        if (obj["print_date"]) {
          this.search_printDate = obj["print_date"];
        }

        if (obj["printer_id"]) {
          this.search_printer = obj["printer_id"];
        }

        if (obj["order_status"]) {
          this.search_orderStatus = obj["order_status"];
        }

        if (obj["page"]) {
          this.search_page = obj["page"];
        }

        if (obj["sale_id"]) {
          this.search_salesRep = obj["sale_id"];
        }

        if (obj["order_type"]) {
          this.search_orderType = obj["order_type"];
        }

        if (obj["date_order"]) {
          this.search_dateOrder = obj["date_order"];
        }

        qs = "?" + qs;
        this.getAllOrders(qs);
      } else {
        if (this.user.role == "Admin") {
          this.search_orderStatus = "Processing";
          this.handleSearch();
        } else {
          this.getAllOrders();
        }
      }
    });

    var thisContext = this;

    setTimeout(function () {
      $("#client_select_form").on(
        "keyup",
        thisContext.delay(thisContext.clientSelectWrap, 500).bind(thisContext)
      );
    }, 750);
  }

  openModal(id, arrivalDate) {
    this.selectedOrderId = id;
    this.selectedOrderArrivalDate = arrivalDate;
    this.form.controls.order_id.setValue(this.selectedOrderId);
    this.form.controls.arrival_date.setValue(this.selectedOrderArrivalDate);
    $("#assignPrinterDialog").modal("show");
  }

  openQRModal(id, name) {
    this.qrIDString = `${environment.baseFEUrl}/administrator?title=${id}`;
    this.qrURLString = `${environment.baseFEUrl}/order-details?id=${id}`;
    this.qrURLShippingString = `${environment.baseFEUrl}/shipping?id=${id}`;
    this.orderId = id;
    this.orderName = name;
    $("#qrCodeDialog").modal("show");

    $("#qrCodeDialog iframe")[0].src = environment.baseFEUrl + "/qrcode?order_id=" + this.orderId +"&order_name=" + this.orderName;

  }

  openShipstationModal(id: any, order: any) {
    this.activeOrderId = id;
    this.showLabel = false;
    this.ship_type = order.ship_type;
    this.notes = order.customer_notes;
    this.weight = order.weight;
    this.boxes = order.boxes;
    $("#shipstationDialog").modal("show");
  }

  openCreateAccountModal() {
    $("#createAccountDialog").modal("show");
  }

  openCreateOrderModal(id = null) {
    var idClause = id !== null ? "&id=" + id : "";
    $("#createOrderDialog").modal("show");
    $("#createOrderDialog")
      .find("h5")
      .text(id === null ? "Create New Order" : "Editing Order");
    $("#createOrderDialog").find("iframe")[0].src =
      environment.baseFEUrl + "/add-order?view=modal" + idClause;
  }

  handleSearch(_timeout?) {
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
      if (this.search_page) {
        queryString += `page=${this.search_page}&`;
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
      if (queryString.length > 0) {
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
        if (this.search_page) {
          queryString += `page=${this.search_page}&`;
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
        if (queryString.length > 0) {
          queryString = queryString;
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

  assignPrinter(type) {
    if (type === "in_home") {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
      } else {
        if (
          !this.form.controls.printer_id.value &&
          !this.form.controls.resource_id.value
        ) {
          alert("Please select a resource or printer");
          return false;
        }

        let formData = new FormData();
        formData.append("type", type);
        Object.keys(this.form.controls).forEach((control) => {
          if (this.form.controls[control].value) {
            formData.append(control, this.form.controls[control].value);
          }
        });
        this.orderService
          .assignPrinter(this.selectedOrderId, formData)
          .subscribe(
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
    } else if (type === "out_side") {
      if (this.formOutSide.invalid) {
        this.formOutSide.markAllAsTouched();
      } else {
        let formData = new FormData();
        formData.append("type", type);
        Object.keys(this.formOutSide.controls).forEach((control) => {
          if (this.formOutSide.controls[control].value) {
            formData.append(control, this.formOutSide.controls[control].value);
          }
        });
        this.orderService
          .assignPrinter(this.selectedOrderId, formData)
          .subscribe(
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

  getAllOrders(queryString?) {
    this.isLoading = true;

    if (queryString) {
      queryString += "&type=dashboard";
      this.orderService.getAllOrders(queryString).subscribe(
        (data: any) => {
          this.isLoading = false;
          this.fullData = data;
          this.orders = data.data;
          this.pagination.current_page = data.current_page;
          this.pagination.last_page = data.last_page;
          this.pagination.total = data.total;

          for (var j in this.orders) {
            this.orders[j].proof_url =
              !/^http/.test(this.orders[j].proof_url) &&
              typeof this.orders[j].proof_url === "string"
                ? environment.awsURL + this.orders[j].proof_url
                : this.orders[j].proof_url;

            this.orders[j].file_url =
              !/^http/.test(this.orders[j].file_url) &&
              typeof this.orders[j].file_url === "string"
                ? environment.awsURL + this.orders[j].file_url
                : this.orders[j].file_url;

            this.orders[j].film_file =
              !/^http/.test(this.orders[j].film_file) &&
              typeof this.orders[j].film_file === "string"
                ? environment.awsURL + this.orders[j].film_file
                : this.orders[j].film_file;
          }

          setTimeout(() => {
            $("#myTable").DataTable({
              destroy: true,
              ordering: false,
              paging: false,
              aoColumnDefs: [
                {
                  bSortable: false,
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
      this.orderService.getAllOrders("type=dashboard").subscribe(
        (data: any) => {
          this.isLoading = false;
          this.fullData = data;
          this.orders = data.data;
          this.pagination.current_page = data.current_page;
          this.pagination.last_page = data.last_page;
          this.pagination.total = data.total;

          setTimeout(() => {
            $("#myTable").DataTable({
              ordering: false,
              paging: false,
              aoColumnDefs: [
                {
                  bSortable: false,
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

  handleAction(order, action) {
    const { id, name } = order;
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
        this.openQRModal(id, name);
        break;
      case "shipping":
        const url = this.router.serializeUrl(
          this.router.createUrlTree(["/shipping"], { queryParams: { id: id } })
        );
        window.open(url, "_blank");
        break;
      case "id_ship_station":
        this.openShipstationModal(id, order);
        break;
      default:
        break;
    }
  }

  deleteOrder(id: any) {
    this.orderService.deleteSingleOrder(id).subscribe(
      (data: any) => {
        if (data.code == 200) {
          this.getAllOrders("?order_status=Processing");
          this.notifier.notify("success", "Order Deleted");
        }
      },
      (error) => {
        this.loggerService.write(error, MessageType.Error);
        this.notifier.notify("error", "An error ocurred. Please try again.");
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

  async submitShipStation() {
    if (this.ssForm.invalid) {
      this.notifier.notify("error", "Required fields are missing");
      return false;
    }
    let formData = new FormData();
    Object.keys(this.ssForm.controls).forEach((control) => {
      formData.append(control, this.ssForm.controls[control].value);
    });

    this.networkCall = true;
    let data: any = await this.orderService
      .createLabel(this.activeOrderId, formData)
      .toPromise();
    this.networkCall = false;
    if (data && data.code != 200) {
      this.notifier.notify("error", data.message);
    } else {
      this.label = data.data.shipping_label_url;
      this.showLabel = true;
      this.ssForm.reset();
      $("#label_link").attr("href", this.label);
    }
  }

  handleCheckbox(e: any, id: any, field: any) {
    $("#" + `${field}_${id}`).val(e.target.checked);
    this.updateOrderStatus(id, field);
  }

  updateOrderStatus(id: any, field: any, status?) {
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
                if (status == 200) {
                  this.notifier.notify("success", "Order Updated");
                }
                if (data.code == 400) {
                  alert(data.message);
                } else {
                  this.handleSearch(0);
                }
              },
              (error) => {
                this.isLoading = false;
                this.loggerService.write(error, MessageType.Error);
                this.notifier.notify(
                  "error",
                  "An error ocurred. Please try again."
                );
              }
            );
          },
          No: () => {
            $(".ui-dialog-content").dialog("close");
            this.isLoading = false;
            this.orderService.updateOrderStatus(id, formData).subscribe(
              (data: any) => {
                this.isLoading = false;
                if (data.code == 200) {
                  this.notifier.notify("success", "Order Updated");
                }
                if (data.code == 400) {
                  alert(data.message);
                } else {
                  this.handleSearch(0);
                }
              },
              (error) => {
                this.isLoading = false;
                this.loggerService.write(error, MessageType.Error);
                this.notifier.notify(
                  "error",
                  "An error ocurred. Please try again."
                );
              }
            );
          },
        },
      });
      return;
    }

    if (field.indexOf("completed") > -1) {
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
            this.isLoading = false;
            this.orderService.updateOrderStatus(id, formData).subscribe(
              (data: any) => {
                this.isLoading = false;
                if (data.code == 200) {
                  this.notifier.notify("success", "Order Updated");
                }
                if (data.code == 400) {
                  alert(data.message);
                } else {
                  this.handleSearch(0);
                }
              },
              (error) => {
                this.isLoading = false;
                this.loggerService.write(error, MessageType.Error);
                this.notifier.notify(
                  "error",
                  "An error ocurred. Please try again."
                );
              }
            );
          },
          No: () => {
            $(".ui-dialog-content").dialog("close");
            this.isLoading = false;
            this.orderService.updateOrderStatus(id, formData).subscribe(
              (data: any) => {
                this.isLoading = false;
                if (data.code == 200) {
                  this.notifier.notify("success", "Order Updated");
                }
                if (data.code == 400) {
                  alert(data.message);
                } else {
                  this.handleSearch(0);
                }
              },
              (error) => {
                this.isLoading = false;
                this.loggerService.write(error, MessageType.Error);
                this.notifier.notify(
                  "success",
                  "An error ocurred. Please try again."
                );
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
        if (data.code == 400) {
          alert(data.message);
        }
        if (data.code == 200) {
          this.notifier.notify("success", "Order Updated");
        }
      },
      (error) => {
        this.isLoading = false;
        this.loggerService.write(error, MessageType.Error);
        this.notifier.notify("error", "An error ocurred. Please try again.");
      }
    );
  }

  alert(type, text) {
    this.notifier.notify(type, text);
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

  updateShipping(id) {
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

  handleCheckboxChange(e) {
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

  handlePageChangeClick(type) {
    if (type == "previous") {
      this.pagination.current_page -= 1;
      this.search_page = this.pagination.current_page + "";
      this.handleSearch();
    }
    if (type == "next") {
      this.pagination.current_page += 1;
      this.search_page = this.pagination.current_page + "";
      this.handleSearch();
    }
  }

  copyDataToShipping(event: any) {
    const { checked } = event.target;

    if (checked) {
      const first_name = this.formCreateAccount.controls["first_name"].value;
      const last_name = this.formCreateAccount.controls["last_name"].value;
      const company = this.formCreateAccount.controls["company"].value;
      const address = this.formCreateAccount.controls["address"].value;
      const aptSte = this.formCreateAccount.controls["street_appartment"].value;
      const contactNumber =
        this.formCreateAccount.controls["contact_number"].value;
      const city = this.formCreateAccount.controls["city"].value;
      const state = this.formCreateAccount.controls["state"].value;
      const zipCode = this.formCreateAccount.controls["zipcode"].value;
      const email = this.formCreateAccount.controls["email"].value;

      this.formCreateAccount.controls["shipping_name"].setValue(first_name);
      this.formCreateAccount.controls["shipping_last_name"].setValue(last_name);
      this.formCreateAccount.controls["shipping_company"].setValue(company);
      this.formCreateAccount.controls["shipping_address"].setValue(address);
      this.formCreateAccount.controls["shipping_street_appartment"].setValue(
        aptSte
      );
      this.formCreateAccount.controls["shipping_phone"].setValue(contactNumber);
      this.formCreateAccount.controls["shipping_city"].setValue(city);
      this.formCreateAccount.controls["shipping_state"].setValue(state);
      this.formCreateAccount.controls["shipping_zipcode"].setValue(zipCode);
      this.formCreateAccount.controls["shipping_email"].setValue(email);
    } else {
      this.formCreateAccount.controls["shipping_name"].setValue("");
      this.formCreateAccount.controls["shipping_last_name"].setValue("");
      this.formCreateAccount.controls["shipping_company"].setValue("");
      this.formCreateAccount.controls["shipping_address"].setValue("");
      this.formCreateAccount.controls["shipping_street_appartment"].setValue(
        ""
      );
      this.formCreateAccount.controls["shipping_phone"].setValue("");
      this.formCreateAccount.controls["shipping_city"].setValue("");
      this.formCreateAccount.controls["shipping_state"].setValue("");
      this.formCreateAccount.controls["shipping_zipcode"].setValue("");
      this.formCreateAccount.controls["shipping_email"].setValue("");
    }
  }

  getClientsList(query = null, thingsToDo = function (a, b) {}) {
    this.orderService.getClientList(query).subscribe(
      (data: any) => {
        this.customers = data.data;
        if (typeof thingsToDo === "function") {
          try {
            thingsToDo(data, this);
          } catch (error) {
            console.log("Failed to get list of clients.");
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  clientSelectWrap(event) {
    //event function
    var query = $(event.target).val();
    this.getClientsList(query, function (data, parentContext) {
      if ($("#client_list").attr("aria-expanded") !== "true") {
        $("#client_selector button").trigger("click");
      }

      $("#list_of_clients,#customer_list_select").empty();

      var currentlySelectedId = $("#clientList").val();

      for (var i in data.data) {
        var dt = data.data[i];
        var isSelectedClause =
          currentlySelectedId + "" === dt.id + "" ? " active" : "";
        $("#list_of_clients").append(
          "\
                <a href='javascript:' class='dropdown-item' customer_id='" +
            dt.id +
            "'>" +
            dt.first_name +
            " " +
            dt.last_name +
            " (" +
            dt.email +
            ")</a>\
                "
        );
      }

      $("#list_of_clients a:not(.active)").on("click", function (event) {
        var id = $(this).attr("customer_id");

        $("#list_of_clients .active").removeClass("active");
        $(this).addClass("active");

        var text = $(this).text();
        $("#client_select_form").val(text);

        parentContext.search_customer = id;
        parentContext.handleSearch();
      });
    });
  }

  delay(fn, ms) {
    let timer = 0;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(fn.bind(this, ...args), ms || 0);
    };
  }

  submitCreateAccount() {
    if (this.formCreateAccount.valid) {
      this.isCreatingAccountLoading = true;
      let formData = new FormData();
      Object.keys(this.formCreateAccount.controls).forEach((controlName) => {
        formData.append(
          controlName,
          this.formCreateAccount.controls[controlName].value
        );
      });

      this.userService.createUser(formData).subscribe(
        (data: any) => {
          this.isCreatingAccountLoading = false;
          if (data.code == 200) {
            $("#dialog-content").text(
              "Account created successfully. Start New Order?"
            );
            $("#createAccountDialog").modal("hide");
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
                  this.router.navigate(["/add-order"]);
                },
                No: () => {
                  $(".ui-dialog-content").dialog("close");
                },
              },
            });
          } else {
            alert(data.message);
            return false;
          }
        },
        (error) => {
          this.isCreatingAccountLoading = false;
          this.loggerService.write(error, MessageType.Error);
        }
      );
    }
  }

  getOrderType(type: string) {
    return this.utilService.getOrderType(type);
  }

  getResourceType(type: string) {
    return this.utilService.getResourceType(type);
  }

  getArrivalType(type: string) {
    return this.utilService.getArrivalType(type);
  }

  getDifferenceInDays(date) {
    return this.utilService.calculateDiffInDays(date);
  }

  getDueInfo(date: any) {
    const diff = this.getDifferenceInDays(date);
    if (diff === -1) return "Today";
    return diff < 0
      ? `Due ${Math.abs(diff) - 1} days ago`
      : `Due in ${Math.abs(diff) + 1} days`;
  }

  getShippingType(type: string) {
    return this.utilService.getShipping(type);
  }
}
