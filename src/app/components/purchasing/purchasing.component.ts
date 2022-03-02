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
  selector: "app-purchasing",
  templateUrl: "./purchasing.component.html",
  styleUrls: ["./purchasing.component.css"],
})
export class PurchasingComponent implements OnInit {
  showElement = true;
  orders = [];
  user: any = {};
  printers = [];
  salesReps = [];
  customers = [];
  checkboxes = [];
  environment = {};
  fullData = {
    current_page: 0,
    last_page: 0,
    total: 0
  };
  search = "";
  search_customer = "";
  search_printDate = "";
  search_dateOrder = "";
  search_orderStatus = "";
  search_page = "";
  search_salesRep = "";
  search_printer = "";
  search_orderType = "";
  search_apparelStatus = "";
  search_type = "purchasing";
  search_po_number = "";
  search_tracking_number = "";
  selectedOrderId = "";
  selectedOrderArrivalDate = "";
  search_payment = 0;
  isLoading = false;

  form = this.fb.group({
    order_id: [""],
    arrival_date: [""],
    printer_id: ["", Validators.required],
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
  timeout;

  toggleSettings = {
    value: false,
    labels: { unchecked: "",checked: ""},
    color: {unchecked: "#dee5ed",checked: "#53df97"},
    switchColor: {checked: "#f5fffd",unchecked: "#53df97"},
    fontColor: {checked: "#fafafa ",unchecked: "#917973"}
  }

  constructor(
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private loggerService: LoggerService,
    private notifier: NotifierService,
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
    }, 0);

    this.environment = environment;

    $("#datepicker_arrival_date").datepicker();
    $("#datepicker_print_date").datepicker();
    $("#search_printDate").datepicker();

    $("#datepicker_arrival_date,#datepicker_print_date,#search_printDate").on(
      "change",
      (event: any) => {
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

        if (obj["apparel"]) {
          this.search_apparelStatus = obj["apparel"];
        }

        if (obj["type"]) {
          this.search_type = obj["type"];
        }

        if (obj["date_order"]) {
          this.search_dateOrder = obj["date_order"];
        }

        if (obj["po_number"]) {
          this.search_po_number = obj["po_number"];
        }

        if (obj["tracking_number"]) {
          this.search_tracking_number = obj["tracking_number"];
        }

        qs = "?" + qs;
        this.getAllOrders(qs);
      } else {
        if (this.user.role == "Admin") {
          this.search_type = "purchasing";
          this.search_apparelStatus = "0";
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

  handleSearch(_timeout?: any) {
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
      if (this.search_apparelStatus) {
        queryString += `apparel=${this.search_apparelStatus}&`;
      }
      if (this.search_type) {
        queryString += `type=${this.search_type}&`;
      }
      if (this.search_dateOrder) {
        queryString += `date_order=${this.search_dateOrder}&`;
      }
      if(this.search_po_number) {
        queryString += `po_number=${this.search_po_number}&`;
      }
      if(this.search_tracking_number) {
        queryString += `po_number=${this.search_tracking_number}&`;
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
        if (this.search_apparelStatus) {
          queryString += `apparel=${this.search_apparelStatus}&`;
        }
        if (this.search_type) {
          queryString += `type=${this.search_type}&`;
        }
        if (this.search_dateOrder) {
          queryString += `date_order=${this.search_dateOrder}&`;
        }
        if(this.search_po_number) {
          queryString += `po_number=${this.search_po_number}&`;
        }
        if(this.search_tracking_number) {
          queryString += `po_number=${this.search_tracking_number}&`;
        }
        if(this.search_payment) {
          queryString += `pay=${this.search_payment}&`;
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
      this.orderService.getAllOrders(queryString).subscribe(
        (data: any) => {
          this.fullData = data;
          this.isLoading = false;
          this.orders = data.data;
          this.pagination.current_page = data.current_page;
          this.pagination.last_page = data.last_page;
          this.pagination.total = data.total;

          setTimeout(() => {
            $("#myTable").DataTable({
              destroy: true,
              ordering: false,
              paging: false,
              info: false
            });
          }, 0);
        },
        (error) => {
          this.isLoading = false;
          this.loggerService.write(error, MessageType.Error);
        }
      );
    } else {
      this.orderService.getAllOrders().subscribe(
        (data: any) => {

          this.isLoading = false;
          this.orders = data.data;
          this.fullData = data;
          this.pagination.current_page = data.current_page;
          this.pagination.last_page = data.last_page;
          this.pagination.total = data.total;

          setTimeout(() => {
            $("#myTable").DataTable({
              ordering: false,
              paging: false,
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
        // this.router.navigate(["/add-order"], { queryParams: { id: id } });
        break;
      case "delete":
        confirm("Are you sure?") == true ? this.deleteOrder(id) : null;
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
                if (data.code == 400) {
                  alert(data.message);
                } else {
                  this.handleSearch(0);
                }
              },
              (err) => {
                this.isLoading = false;
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

    this.isLoading = false;
    this.orderService.updateOrderStatus(id, formData).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data.code == 400) {
          alert(data.message);
        }
        if (data.code === 200) {
          this.notifier.notify("success", "Order Updated");
        }
      },
      (error) => {
        this.isLoading = false;
        this.loggerService.write(error, MessageType.Error);
        this.notifier.notify("error", "An error ocurred. Please try again");
      }
    );
  }

  getSQLDate(str: any) {
    let date = new Date(str);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let dateString = `${date.getFullYear()}-${month < 10 ? "0" + month : month
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
          this.location.go(this.router.url.split("?")[0], "");
          location.reload();
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

  getProductsFromOrder(order: any) {
    let products = [];
    for (let index = 1; index <= 5; index++) {
      let obj = {};
      let productUserType = order[`product_user_type_${index}`];
      let _productUserType = "";

      if (productUserType) {
        let raw = productUserType.split(",");
        _productUserType = raw[0];
      }

      obj[`product_user_type_${index}`] = _productUserType;
      obj[`xs_${index}`] = order[`xs_${index}`];
      obj[`s_${index}`] = order[`s_${index}`];
      obj[`m_${index}`] = order[`m_${index}`];
      obj[`l_${index}`] = order[`l_${index}`];
      obj[`xl_${index}`] = order[`xl_${index}`];
      obj[`xxl_${index}`] = order[`xxl_${index}`];
      obj[`xxxl_${index}`] = order[`xxxl_${index}`];
      obj[`other_size_1_${index}`] = order[`other_size_1_${index}`];
      obj[`other_size_2_${index}`] = order[`other_size_2_${index}`];
      obj[`other_size_3_${index}`] = order[`other_size_3_${index}`];
      obj[`other_size_4_${index}`] = order[`other_size_4_${index}`];
      obj[`product_color_${index}`] = order[`product_color_${index}`];
      obj[`apparel_type_${index}`] = order[`apparel_type_${index}`];

      obj[`pcs_1_${index}`] = order[`pcs_1_${index}`];
      obj[`pcs_2_${index}`] = order[`pcs_2_${index}`];
      obj[`pcs_3_${index}`] = order[`pcs_3_${index}`];
      obj[`pcs_4_${index}`] = order[`pcs_4_${index}`];

      obj[`product_description_${index}`] =
        order[`product_description_${index}`];

      obj[`product_apparel_source_${index}`] =
        order[`product_apparel_source_${index}`];
      obj[`item_number_${index}`] = order[`item_number_${index}`];

      products.push(obj);
    }
    return products;
  }

  shouldShowThisProduct(product: any) {
    let str = "";
    Object.keys(product).forEach((key) => {
      if (product[key]) {
        str += product[key];
      }
    });
    return str.length > 0;
  }

  handlePageChangeClick(type: any) {
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

  onToggleChange(value) {
    this.search_payment = value ? 1 : 0;
    this.handleSearch(0);
  }

  openCreateOrderModal(id = null) {
    var idClause = (id !== null) ? "&id="+id : "";
    $('#createOrderDialog').modal('show');
    $('#createOrderDialog').find("h5").text(id === null ? "Create New Order" : "Editing Order");
    $('#createOrderDialog').find('iframe')[0].src = environment.baseFEUrl+"/add-order?view=modal"+idClause
  }
}
