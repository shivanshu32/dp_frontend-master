import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let OrderDetailsComponent = /** @class */ (() => {
    let OrderDetailsComponent = class OrderDetailsComponent {
        constructor(route, orderService, router) {
            this.route = route;
            this.orderService = orderService;
            this.router = router;
            this.order = {};
            this.products = [];
            this.multipleProducts = [];
        }
        ngOnInit() {
            this.route.queryParams.subscribe((data) => __awaiter(this, void 0, void 0, function* () {
                if (data.id) {
                    // if single id
                    // this.getOrderDetails(data.id);
                    // if multiple ids
                    let arr = data.id.split(",");
                    this.multipleProducts = [];
                    for (const iterator of arr) {
                        yield this.getMultipleOrder(iterator);
                    }
                    console.log("finished processing");
                    this.updateProducts();
                }
                else {
                    this.router.navigate(["/"]);
                }
            }));
        }
        getOrderDetails(id) {
            this.orderService.getOrderDetails(id).subscribe((data) => {
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
                        obj[`product_color_${index}`] = this.order[`product_color_${index}`];
                        obj[`apparel_type_${index}`] = this.order[`apparel_type_${index}`];
                        obj[`pcs_1_${index}`] = this.order[`pcs_1_${index}`];
                        obj[`pcs_2_${index}`] = this.order[`pcs_2_${index}`];
                        obj[`pcs_3_${index}`] = this.order[`pcs_3_${index}`];
                        obj[`pcs_4_${index}`] = this.order[`pcs_4_${index}`];
                        obj[`product_description_${index}`] = this.order[`product_description_${index}`];
                        this.products.push(obj);
                    }
                }
                else {
                    this.router.navigate(["/"]);
                }
            }, (err) => {
                console.log(err);
            });
        }
        getMultipleOrder(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let order = yield this.orderService.getOrderDetails(id).toPromise();
                    console.log(order);
                    if (order.data) {
                        this.multipleProducts.push(order.data);
                    }
                }
                catch (error) {
                    console.log(error);
                }
                // console.log(this.multipleProducts)
            });
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
                    obj[`product_description_${index}`] = order[`product_description_${index}`];
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
    };
    OrderDetailsComponent = __decorate([
        Component({
            selector: "app-order-details",
            templateUrl: "./order-details.component.html",
            styleUrls: ["./order-details.component.css"],
        })
    ], OrderDetailsComponent);
    return OrderDetailsComponent;
})();
export { OrderDetailsComponent };
//# sourceMappingURL=order-details.component.js.map