import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { OrderService } from "src/app/services/order.service";
declare var $: any;

@Component({
  selector: "app-resource-order-details",
  templateUrl: "./resource-order-details.component.html",
  styleUrls: ["./resource-order-details.component.css"],
})
export class ResourceOrderDetailsComponent implements OnInit {
  order: any = {};
  passwordMatched = false;
  passwordAttempted = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private notifier: NotifierService
  ) {}

  download(url) {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(async (data) => {
      if (data.id) {
        // if single id
        // this.getOrderDetails(data.id);

        // if multiple ids
        let arr = data.id.split(",");
        this.multipleProducts = [];
        for (const iterator of arr) {
          await this.getMultipleOrder(iterator);
        }
        console.log("finished processing");
        this.updateProducts();
      } else {
        this.router.navigate(["/"]);
      }
    });
  }

  products = [];
  getOrderDetails(id) {
    this.orderService.getOrderDetails(id).subscribe(
      (data: any) => {
        if (data.data) {
          this.order = data.data;
          console.log(this.order);

          for (let index = 1; index <= 5; index++) {
            let obj = {};
            let productUserType = this.order[`product_user_type_${index}`];
            let _productUserType = "";

            if (productUserType) {
              let raw = productUserType.split(",");
              console.log(raw);
              _productUserType = raw[0];
            }

            obj[`product_user_type_${index}`] = _productUserType;
            obj[`xs_${index}`] = this.order[`xs_${index}`];
            obj[`s_${index}`] = this.order[`s_${index}`];
            obj[`m_${index}`] = this.order[`m_${index}`];
            obj[`l_${index}`] = this.order[`l_${index}`];
            obj[`xl_${index}`] = this.order[`xl_${index}`];
            obj[`xxl_${index}`] = this.order[`xxl_${index}`];
            obj[`xxxl_${index}`] = this.order[`xxxl_${index}`];
            obj[`other_size_1_${index}`] = this.order[`other_size_1_${index}`];
            obj[`other_size_2_${index}`] = this.order[`other_size_2_${index}`];
            obj[`other_size_3_${index}`] = this.order[`other_size_3_${index}`];
            obj[`other_size_4_${index}`] = this.order[`other_size_4_${index}`];
            obj[`product_color_${index}`] =
              this.order[`product_color_${index}`];
            obj[`apparel_type_${index}`] = this.order[`apparel_type_${index}`];

            obj[`pcs_1_${index}`] = this.order[`pcs_1_${index}`];
            obj[`pcs_2_${index}`] = this.order[`pcs_2_${index}`];
            obj[`pcs_3_${index}`] = this.order[`pcs_3_${index}`];
            obj[`pcs_4_${index}`] = this.order[`pcs_4_${index}`];

            obj[`product_description_${index}`] =
              this.order[`product_description_${index}`];

            this.products.push(obj);
          }
        } else {
          this.router.navigate(["/"]);
        }
      },
      (err) => {
        this.notifier.notify("error", err.message);
        console.log(err);
      }
    );
  }

  multipleProducts = [];
  async getMultipleOrder(id) {
    try {
      let order: any = await this.orderService.getOrderDetails(id).toPromise();
      console.log(order);
      if (order.data) {
        order.data.proof_url += `?id=${new Date().getTime()}`;

        // console.log(order.data.temp_password);
        // this.multipleProducts.push(order.data);

        if(order.data.temp_password){
          let ans = prompt("Please enter the password.","");
          this.passwordAttempted = true;
          if(ans){
            if(ans === order.data.temp_password){
              this.passwordMatched = true;
              this.multipleProducts.push(order.data);
            }
          }else{
            this.passwordMatched = false;
          }
        }
      }
    } catch (error) {
      this.notifier.notify("error", error.message);
      console.log(error);
    }

    // console.log(this.multipleProducts)
  }

  updateProducts() {
    let orders = [];

    this.multipleProducts.forEach((order) => {
      order["products"] = [];

      for (let index = 1; index <= 5; index++) {
        let obj = {};
        let productUserType = order[`product_user_type_${index}`];
        let _productUserType = "";

        if (productUserType) {
          let raw = productUserType.split(",");
          console.log(raw);
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

        order["products"].push(obj);
        // this.products.push(obj);
      }

      // console.log(order);
      orders.push(order);
    });

    // console.log(orders)
    this.multipleProducts = orders;
    console.log(this.multipleProducts);
  }

  getTimestamp() {
    return new Date().getTime();
  }

  handleLongString(str, length) {
    if (!str) {
      return "";
    }
    if (str.length > length) {
      return str.substr(0, length) + "...";
    } else {
      return str;
    }
  }

  getProductSizes(product, index) {
    let sizes = [];
    if (product[`xs_${index}`]) {
      sizes.push({
        size: `xs`,
        value: product[`xs_${index}`],
      });
    }

    if (product[`s_${index}`]) {
      sizes.push({
        size: `s`,
        value: product[`s_${index}`],
      });
    }

    if (product[`m_${index}`]) {
      sizes.push({
        size: `m`,
        value: product[`m_${index}`],
      });
    }

    if (product[`l_${index}`]) {
      sizes.push({
        size: `l`,
        value: product[`l_${index}`],
      });
    }

    if (product[`xl_${index}`]) {
      sizes.push({
        size: `xl`,
        value: product[`xl_${index}`],
      });
    }

    if (product[`xxl_${index}`]) {
      sizes.push({
        size: `xxl`,
        value: product[`xxl_${index}`],
      });
    }

    if (product[`xxxl_${index}`]) {
      sizes.push({
        size: `xxxl`,
        value: product[`xxxl_${index}`],
      });
    }

    if (product[`other_size_1_${index}`]) {
      sizes.push({
        size: product[`other_size_1_${index}`],
        value: product[`pcs_1_${index}`],
      });
    }

    if (product[`other_size_2_${index}`]) {
      sizes.push({
        size: product[`other_size_2_${index}`],
        value: product[`pcs_2_${index}`],
      });
    }

    if (product[`other_size_3_${index}`]) {
      sizes.push({
        size: product[`other_size_3_${index}`],
        value: product[`pcs_3_${index}`],
      });
    }

    if (product[`other_size_4_${index}`]) {
      sizes.push({
        size: product[`other_size_4_${index}`],
        value: product[`pcs_4_${index}`],
      });
    }

    if (sizes.length < 10) {
      for (let index = sizes.length; index < 10; index++) {
        sizes.push({
          size: "",
          value: "",
        });
      }
    }

    return sizes;
  }
}
