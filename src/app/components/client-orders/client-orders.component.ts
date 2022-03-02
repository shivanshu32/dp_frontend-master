import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "src/app/services/order.service";
declare var $: any;
@Component({
  selector: "app-client-orders",
  templateUrl: "./client-orders.component.html",
  styleUrls: ["./client-orders.component.css"],
})
export class ClientordersComponent implements OnInit {
  orderList = [];
  status: string = "";
  table: any;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

    // this.table = $("#myTable").DataTable({
    //   order: [[3, "desc"]],
    //   aoColumnDefs: [
    //     {
    //       bSortable: false,
    //       aTargets: [4, 5, 7],
    //     },
    //   ],
    // });

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
      } else {
        // completed orders
        this.getAllCompletedOrders();
      }
    });
  }

  getAllOpenOrders() {
    this.orderList = [];
    this.orderService.getAllClientOpenOrders().subscribe(
      (data: any) => {
        this.orderList = data.data;
        console.log(this.orderList);
        // this.table = $("#myTable").DataTable();
        // this.table.clear();
        // this.table.draw();

        // this.cd.markForCheck();

        setTimeout(() => {
          if (this.table) {
            this.table.destroy();
          }
          this.table = $("#myTable").DataTable({
            destroy: true,
            ordering:false,
            order: [[3, "desc"]],
            aoColumnDefs: [
              {
                bSortable: false,
                aTargets: [4, 5, 7],
              },
            ],
          });
        }, 0);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllCompletedOrders() {
    this.orderList = [];
    this.orderService.getAllClientCompletedOrders().subscribe(
      (data: any) => {
        this.orderList = data.data;
        console.log(this.orderList);

        setTimeout(() => {
          console.log(this.table);
          if (this.table) {
            this.table.destroy();
          }
          this.table = $("#myTable").DataTable({
            destroy: true,
            ordering:false,
            order: [[3, "desc"]],
            aoColumnDefs: [
              {
                bSortable: false,
                aTargets: [4, 5, 7],
              },
            ],
          });
        }, 0);
      },
      (err) => {
        console.log(err);
      }
    );
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
    this.orderService.deleteClientSingleOrder(id).subscribe(
      (data: any) => {
        console.log(data);
        if (data.code == 200) {
          this.getData();
        } else {
          alert(data.message);
        }
      },
      (err) => {}
    );
  }
}
