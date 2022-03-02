import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

import { OrderService } from 'src/app/services/order.service';
import { AuthService } from "src/app/services/auth.service";
import { UtilService } from "src/app/services/util.service";
import { environment } from "../../../environments/environment";

declare var $: any;

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit {
  orders = [];
  salesReps = [];
  printers = [];
  user: any = {};
  environment = {};

  isLoading = false;
  search = "";
  search_page = "";
  search_salesRep = "";
  search_orderStatus = "";
  search_printer = "";
  search_orderType = "";

  pagination = {
    current_page:0,
    last_page:0,
    total:0
  }

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private utilService: UtilService,
    private location: Location)
    {
      this.user = this.authService.getLocalUser();
    }

  ngOnInit(): void {
    setTimeout(async() => {
      this.getAllPrinters();
      this.getAllSalesRep();
    }, 0);

    this.environment = environment;

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

  timeout;
  handleSearch(_timeout?) {
    if (_timeout) {
      let queryString = "";
      if (this.search) {
        queryString += `title=${this.search}&`;
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

  getAllSalesRep() {
    this.orderService.getAllSalesReps().subscribe(
      (data: any) => {
        this.salesReps = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllPrinters() {
    this.orderService.getAllPrinters().subscribe(
      (data: any) => {
        this.printers = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handlePageChangeClick(type){
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

  shouldShowThisProduct(product) {
    let str = "";
    Object.keys(product).forEach((key) => {
      if (product[key]) {
        str += product[key];
      }
    });
    return str.length > 0;
  }

  onUpdateDot(index, prop) {
    const value = this.orders[index][prop] === 'false' ? 'true' : 'false';
    this.orders[index][prop] = value;
    let formData = new FormData();
    formData.append(prop, value);

    this.isLoading = false;
    this.orderService.updateOrderStatus(this.orders[index]['id'], formData).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data.code == 400) {
          alert(data.message);
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  getProductsFromOrder(order) {
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

      obj[`apparel_type_${index}`] = order[`apparel_type_${index}`];

      products.push(obj);
    }

    return products;
  }

  handleAction(orderId, action) {
    switch (action) {
      case "view":
        this.router.navigate(["/order-details"], { queryParams: { id: orderId } });
        break;
      case "edit":
        this.openCreateOrderModal(orderId);
        break;
    }
  }

  getShippingMethod(method) {
    const methods = {
      pickup: "Pickup",
      courier: "Courier",
      hand_deliver: "Hand Deliver",
      shipping_others: "Other",
      "USPS First Class Mail": "USPS First Class Mail",
      "USPS Media Mail": "USPS Media Mail",
      "USPS Parcel Select Ground": "USPS Parcel Select Ground",
      "USPS Priority Mail": "USPS Priority Mail",
      "USPS Priority Mail Express": "USPS Priority Mail Express",
      "FedEx Ground": "FedEx Ground",
      "FedEx Home Delivery": "FedEx Home Delivery",
      "FedEx 2Day":"FedEx 2Day",
      "FedEx Express Saver": "FedEx Express Saver",
      "FedEx Standard Overnight": "FedEx Standard Overnight",
      "FedEx Priority Overnight": "FedEx Priority Overnight",
      "FedEx First Overnight": "FedEx First Overnight",
      "FedEx 1Day Freight": "FedEx 1Day Freight",
      "FedEx 2Day Freight": "FedEx 2Day Freight",
      "FedEx 3Day Freight": "FedEx 3Day Freight",
      "FedEx First Overnight Freight": "FedEx First Overnight Freight",
      "UPS Ground": "UPS Ground",
      "UPS 3 Day Select": "UPS 3 Day Select",
      "UPS 2nd Day Air": "UPS 2nd Day Air",
      "UPS Next Day Air Saver": "UPS Next Day Air Saver",
      "UPS Next Day Air": "UPS Next Day Air",
      "UPS Next Day Air Early": "UPS Next Day Air Early",
      "UPS 2nd Day Air AM": "UPS 2nd Day Air AM",
    };

    return methods[method];
  }

  updateOrderStatus(id, field, status?) {
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
                console.log(error);
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
                console.log(error);
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
                if (data.code == 400) {
                  alert(data.message);
                } else {
                  this.handleSearch(0);
                }
              },
              (error) => {
                this.isLoading = false;
                console.log(error);
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
                console.log(error);
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
        }else{
          this.handleSearch(0);
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  getAllOrders(queryString?) {
    this.isLoading = true;
    if(queryString) {
      this.orderService.getAllOrders(queryString).subscribe(
        (data: any) => {
          this.isLoading = false;
          console.log(data);
          this.orders = data.data;
          this.pagination.current_page = data.current_page;
          this.pagination.last_page = data.last_page;
          this.pagination.total = data.total;

          setTimeout(() => {
            $("#myTable").DataTable({
              destroy: true,
              ordering: false,
              paging:false
            });
          }, 0);

        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );
    }else{
      this.orderService.getAllOrders().subscribe(
        (data: any) => {
          this.isLoading = false;
          this.orders = data.data;
          this.pagination.current_page = data.current_page;
          this.pagination.last_page = data.last_page;
          this.pagination.total = data.total;

          setTimeout(() => {
            $("#myTable").DataTable({
              destroy: true,
              ordering: false,
              paging:false
            });
          }, 0);
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );
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
