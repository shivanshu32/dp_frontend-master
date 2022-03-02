import { __decorate } from "tslib";
import { Component, HostListener } from "@angular/core";
import { Validators } from "@angular/forms";
import * as pantone from "nearest-pantone";
let AddOrderComponent = /** @class */ (() => {
    let AddOrderComponent = class AddOrderComponent {
        constructor(orderService, fb, route, router, authService) {
            this.orderService = orderService;
            this.fb = fb;
            this.route = route;
            this.router = router;
            this.authService = authService;
            this.clientList = [];
            this.user = {};
            this.isLoading = false;
            this.formObj = {
                customer_id: ["", [Validators.required]],
                name: ["", [Validators.required]],
                type: ["", [Validators.required]],
                type_other: [""],
                type_notes: [""],
                arrival_type: ["", [Validators.required]],
                arrival_other: [""],
                arrival_date: ["", [Validators.required]],
                hard_due_date: [false],
                art_is_sized: [false],
                art_notes: [""],
                order_arts: [[]],
                color_1: ["#333333"],
                color_1_pantone: [""],
                color_2: ["#333333"],
                color_2_pantone: [""],
                color_3: ["#333333"],
                color_3_pantone: [""],
                color_4: ["#999999"],
                color_4_pantone: [""],
                color_5: ["#999999"],
                color_5_pantone: [""],
                color_6: ["#999999"],
                color_6_pantone: [""],
                payment_invoice_url: [""],
                payment_notes: [""],
                payment_terms: [false],
                ship_type: [""],
                ship_notes: [""],
                ship_terms: [false],
                customer_name: [""],
                customer_attn: [""],
                customer_track_url: [""],
                customer_notes: [""],
                customer_address: [""],
                customer_state: [""],
                customer_zipcode: [""],
                customer_email: ["", [Validators.email]],
                customer_phone: [""],
                shipping_label_url: [""],
                packing_list_url: [""],
                setup_name: [""],
                setup_screen_1: [""],
                setup_screen_2: [""],
                setup_notes: [""],
                proof_url: [""],
                proof_notes: [""],
                position_front: [""],
                position_back: [""],
                position_right_left: [""],
                position_additional: [""],
                position_notes: [""],
                color_notes: [""],
                customer_address_2: [""],
                multiple_pages: [false],
                match_proof_position: [false],
                match_proof_color: [false],
            };
            this.editMode = false;
            this.order_id = 0;
            this.productArr = [];
            this.productArrGrouped = [];
            this.showOrderOthers = false;
            this.showApparelOthers = false;
            this.showArrivalOthers = false;
            this.showShippingOthers = false;
            this.showApparelOthers_1 = false;
            this.showApparelOthers_2 = false;
            this.showApparelOthers_3 = false;
            this.showApparelOthers_4 = false;
            this.showApparelOthers_5 = false;
            this.files = [];
            this.overlayToggled = false;
            this.user = this.authService.getLocalUser();
        }
        doSomething($event) {
            $event.returnValue = "Your data will be lost!";
        }
        ngOnInit() {
            this.isLoading = true;
            this.initForm();
            // history.pushState(null, null, document.URL);
            // window.addEventListener("popstate", function () {
            //   if(confirm("All the unsaved information will be lost")){
            //     history.back();
            //   }else{
            //     history.pushState(null, null, document.URL);
            //   }
            // });
        }
        addOrder() {
            this.form.markAllAsTouched();
            // console.log(this.form.controls.artfile.value);
            // all product types
            this.form.controls.product_user_type_1.setValue($("#product_user_type_1").val()
                ? $("#product_user_type_1").val().toString()
                : "");
            this.form.controls.product_user_type_2.setValue($("#product_user_type_2").val()
                ? $("#product_user_type_2").val().toString()
                : "");
            this.form.controls.product_user_type_3.setValue($("#product_user_type_3").val()
                ? $("#product_user_type_3").val().toString()
                : "");
            this.form.controls.product_user_type_4.setValue($("#product_user_type_4").val()
                ? $("#product_user_type_4").val().toString()
                : "");
            this.form.controls.product_user_type_5.setValue($("#product_user_type_5").val()
                ? $("#product_user_type_5").val().toString()
                : "");
            if (this.form.controls.proof_url.value instanceof File) {
            }
            else {
                this.form.controls.proof_url.setValue("");
            }
            if (this.form.controls.packing_list_url.value instanceof File) {
            }
            else {
                this.form.controls.packing_list_url.setValue("");
            }
            if (this.form.controls.shipping_label_url.value instanceof File) {
            }
            else {
                this.form.controls.shipping_label_url.setValue("");
            }
            if (this.form.invalid) {
                this.form.markAllAsTouched();
                return false;
            }
            else {
                this.isLoading = true;
                let formData = new FormData();
                Object.keys(this.form.controls).forEach((controls) => {
                    // console.log(controls, this.form.controls[controls].value);
                    formData.append(controls, this.form.controls[controls].value);
                });
                if (this.files.length > 0) {
                    for (let index = 0; index < this.files.length; index++) {
                        formData.append("artfile[]", this.files[index]);
                    }
                }
                document.body.scrollTo(0, 0);
                if (this.editMode) {
                    //update the order
                    this.orderService.updateOrder(this.order_id, formData).subscribe((data) => {
                        console.log(data);
                        this.isLoading = false;
                        if (data.code == 200) {
                            this.router.navigate(["/"]);
                        }
                    }, (err) => {
                        this.isLoading = false;
                        console.log(err);
                    });
                }
                else {
                    this.orderService.createOrder(formData).subscribe((data) => {
                        console.log(data);
                        if (data.code == 200) {
                            this.isLoading = false;
                            this.router.navigate(["/"]);
                        }
                    }, (err) => {
                        this.isLoading = false;
                        console.log(err);
                    });
                }
            }
        }
        initForm() {
            for (let index = 1; index <= 5; index++) {
                this.formObj[`product_user_type_${index}`] = [""];
                this.formObj[`product_user_other_type_${index}`] = [""];
                this.formObj[`per_piece_${index}`] = [""];
                this.formObj[`tax_${index}`] = [false];
                this.formObj[`item_number_${index}`] = [""];
                this.formObj[`apparel_type_${index}`] = [""];
                this.formObj[`product_color_${index}`] = [""];
                this.formObj[`product_description_${index}`] = [""];
                this.formObj[`product_apparel_source_${index}`] = [""];
                this.formObj[`product_apparel_source_other_${index}`] = [""];
                this.formObj[`xs_${index}`] = [""];
                this.formObj[`s_${index}`] = [""];
                this.formObj[`m_${index}`] = [""];
                this.formObj[`l_${index}`] = [""];
                this.formObj[`xl_${index}`] = [""];
                this.formObj[`xxl_${index}`] = [""];
                this.formObj[`xxxl_${index}`] = [""];
                this.formObj[`other_size_1_${index}`] = [""];
                this.formObj[`other_size_text_1_${index}`] = [""];
                this.formObj[`pcs_1_${index}`] = [""];
                this.formObj[`other_size_2_${index}`] = [""];
                this.formObj[`other_size_text_2_${index}`] = [""];
                this.formObj[`pcs_2_${index}`] = [""];
                this.formObj[`other_size_3_${index}`] = [""];
                this.formObj[`other_size_text_3_${index}`] = [""];
                this.formObj[`pcs_3_${index}`] = [""];
                this.formObj[`other_size_4_${index}`] = [""];
                this.formObj[`other_size_text_4_${index}`] = [""];
                this.formObj[`pcs_4_${index}`] = [""];
                this.productArr.push(`product_user_type_${index}`);
                this.productArr.push(`product_user_other_type_${index}`);
                this.productArr.push(`per_piece_${index}`);
                this.productArr.push(`tax_${index}`);
                this.productArr.push(`item_number_${index}`);
                this.productArr.push(`apparel_type_${index}`);
                this.productArr.push(`product_color_${index}`);
                this.productArr.push(`product_description_${index}`);
                this.productArr.push(`product_apparel_source_${index}`);
                this.productArr.push(`product_apparel_source_other_${index}`);
                this.productArr.push(`xs_${index}`);
                this.productArr.push(`s_${index}`);
                this.productArr.push(`l_${index}`);
                this.productArr.push(`xl_${index}`);
                this.productArr.push(`xxl_${index}`);
                this.productArr.push(`xxxl_${index}`);
                this.productArr.push(`other_size_1_${index}`);
                this.productArr.push(`other_size_text_1_${index}`);
                this.productArr.push(`pcs_1_${index}`);
                this.productArr.push(`other_size_2_${index}`);
                this.productArr.push(`other_size_text_2_${index}`);
                this.productArr.push(`pcs_2_${index}`);
                this.productArr.push(`other_size_3_${index}`);
                this.productArr.push(`other_size_text_3_${index}`);
                this.productArr.push(`pcs_3_${index}`);
                this.productArr.push(`other_size_4_${index}`);
                this.productArr.push(`other_size_text_4_${index}`);
                this.productArr.push(`pcs_4_${index}`);
                // this.productArrGrouped.push({index:this.productArr});
                this.productArrGrouped[index] = this.productArr;
                this.productArr = [];
            }
            this.form = this.fb.group(this.formObj);
            this.productArrGrouped.splice(0, 1);
            this.getClientsList();
        }
        getOrderDetails() {
            this.orderService.getOrderDetails(this.order_id).subscribe((data) => {
                console.log(data);
                if (data.data) {
                    this.editMode = true;
                    Object.keys(data.data).forEach((control) => {
                        // console.log(control, data.data[control]);
                        try {
                            this.form.controls[control].setValue(data.data[control] == null ||
                                data.data[control] == undefined ||
                                data.data[control] == "undefined" ||
                                data.data[control] == "null"
                                ? ""
                                : data.data[control]);
                            if (control.indexOf("product_user_type_") > -1) {
                                $("#" + control)
                                    .val(data.data[control] == null ||
                                    data.data[control] == undefined ||
                                    data.data[control] == "undefined" ||
                                    data.data[control] == "null"
                                    ? ""
                                    : data.data[control].split(","))
                                    .trigger("change");
                            }
                            if (control.indexOf("color") > -1) {
                                $("#" + control).trigger("change");
                            }
                            if (control.indexOf("product_apparel_source_") > -1) {
                                $("#" + control).trigger("change");
                            }
                            if (control.indexOf("other_size_") > -1) {
                                $("#" + control).trigger("change");
                            }
                        }
                        catch (error) {
                            // console.log(control, "not found in the form");
                        }
                    });
                    $("#orderType").trigger("change");
                    $("#clientList").trigger("change");
                    $("#arrivalTime").trigger("change");
                    $("#shippingMethod").trigger("change");
                    setTimeout(() => {
                        $("#art-images")
                            .not(".slick-initialized")
                            .slick({
                            infinite: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: true,
                            slide: "li",
                            fade: false,
                            dots: false,
                        })
                            .trigger("change");
                    }, 0);
                }
                else {
                    this.editMode = false;
                }
            }, (err) => {
                console.log(err);
            });
        }
        initAllDropdowns() {
            $("#art-images-temp").slick(this.getSlickSettings());
            $("#orderType").select2({ minimumResultsForSearch: -1 });
            $("#product_apparel_source_1").select2({ minimumResultsForSearch: -1 });
            $("#product_apparel_source_2").select2({ minimumResultsForSearch: -1 });
            $("#product_apparel_source_3").select2({ minimumResultsForSearch: -1 });
            $("#product_apparel_source_4").select2({ minimumResultsForSearch: -1 });
            $("#product_apparel_source_5").select2({ minimumResultsForSearch: -1 });
            $("#other_size_1_1").select2({ minimumResultsForSearch: -1 });
            $("#other_size_1_2").select2({ minimumResultsForSearch: -1 });
            $("#other_size_1_3").select2({ minimumResultsForSearch: -1 });
            $("#other_size_1_4").select2({ minimumResultsForSearch: -1 });
            $("#other_size_1_5").select2({ minimumResultsForSearch: -1 });
            $("#other_size_2_1").select2({ minimumResultsForSearch: -1 });
            $("#other_size_2_2").select2({ minimumResultsForSearch: -1 });
            $("#other_size_2_3").select2({ minimumResultsForSearch: -1 });
            $("#other_size_2_4").select2({ minimumResultsForSearch: -1 });
            $("#other_size_2_5").select2({ minimumResultsForSearch: -1 });
            $("#other_size_3_1").select2({ minimumResultsForSearch: -1 });
            $("#other_size_3_2").select2({ minimumResultsForSearch: -1 });
            $("#other_size_3_3").select2({ minimumResultsForSearch: -1 });
            $("#other_size_3_4").select2({ minimumResultsForSearch: -1 });
            $("#other_size_3_5").select2({ minimumResultsForSearch: -1 });
            $("#other_size_4_1").select2({ minimumResultsForSearch: -1 });
            $("#other_size_4_2").select2({ minimumResultsForSearch: -1 });
            $("#other_size_4_3").select2({ minimumResultsForSearch: -1 });
            $("#other_size_4_4").select2({ minimumResultsForSearch: -1 });
            $("#other_size_4_5").select2({ minimumResultsForSearch: -1 });
            $("#product_user_type_1").select2({
                placeholder: "something",
                minimumResultsForSearch: -1,
            });
            // $("#demographic_1").val(["0: 'youth'", "1: 'women'","2: 'men'"]).trigger("change");
            $("#product_user_type_2").select2({
                placeholder: "Type",
                minimumResultsForSearch: -1,
            });
            $("#product_user_type_3").select2({
                placeholder: "Type",
                minimumResultsForSearch: -1,
            });
            $("#product_user_type_4").select2({
                placeholder: "Type",
                minimumResultsForSearch: -1,
            });
            $("#product_user_type_5").select2({
                placeholder: "Type",
                minimumResultsForSearch: -1,
            });
            $("#select5").select2({ minimumResultsForSearch: -1 });
            $("#select6").select2({ minimumResultsForSearch: -1 });
            $("#select7").select2({ minimumResultsForSearch: -1 });
            $("#select8").select2({ minimumResultsForSearch: -1 });
            $("#arrivalTime").select2({ minimumResultsForSearch: -1 });
            $("#shippingMethod").select2({ minimumResultsForSearch: -1 });
            $("#selecta").select2({ minimumResultsForSearch: -1 });
            $("#selectb").select2({ minimumResultsForSearch: -1 });
            $("#selectc").select2({ minimumResultsForSearch: -1 });
            $("#selecte").select2({ minimumResultsForSearch: -1 });
            $("#selectd").select2({ minimumResultsForSearch: -1 });
            $("#datepicker").datepicker({ dateFormat: "mm-dd-yy" });
            $("#color_1").spectrum({ type: "text" });
            $("#color_2").spectrum({ type: "text" });
            $("#color_3").spectrum({ type: "text" });
            $("#color_4").spectrum({ type: "text" });
            $("#color_5").spectrum({ type: "text" });
            $("#color_6").spectrum({ type: "text" });
            setTimeout(() => {
                $("#color_1,#color_2,#color_3,#color_4,#color_5,#color_6").trigger("change");
            }, 0);
            // $(".slider-sec").slick("reinit");
            // $().ready(function(){
            $("#slider-product").slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                lazyLoad: "progressive",
                autoplay: false,
                arrows: true,
                infinite: false,
                slide: "li",
                fade: false,
                dots: true,
                centerMode: false,
                variableWidth: false,
            });
            // $("#slider-product").show();
            // })
            $(".open-menu").click(function () {
                $(".dash-head-user").addClass("active");
            });
            $(".close-menu").click(function () {
                $(".dash-head-user").removeClass("active");
            });
            $("#datepicker,#other_size_4_1,#other_size_4_2,#other_size_4_3,#other_size_4_4,#other_size_4_5,#other_size_3_1,#other_size_3_2,#other_size_3_3,#other_size_3_4,#other_size_3_5,#other_size_2_1,#other_size_2_2,#other_size_2_3,#other_size_2_4,#other_size_2_5,#orderType,#other_size_1_1,#other_size_1_2,#other_size_1_3,#other_size_1_4,#other_size_1_5,#product_apparel_source_1,#product_apparel_source_2,#product_apparel_source_3,#product_apparel_source_4,#product_apparel_source_5,#arrivalTime,#shippingMethod,#clientList,#color_1,#color_2,#color_3,#color_4,#color_5,#color_6").on("change", (event) => {
                this.handleSelectChange(event);
            });
            // $(".select2-search, .select2-focusser").remove();
            this.isLoading = false;
        }
        getClientsList() {
            this.orderService.getClientList().subscribe((data) => {
                this.clientList = data.data;
                console.log(this.clientList);
                $("#clientList").select2();
                if (this.user.role === "Customer") {
                    // console.log(this.user.id)
                    setTimeout(() => {
                        $("#clientList").val(this.user.id).trigger("change");
                    }, 0);
                }
                this.initAllDropdowns();
                // this.initAllDropdowns();
                this.route.queryParams.subscribe((data) => {
                    if (data.id) {
                        this.order_id = data.id;
                        this.editMode = true;
                        this.getOrderDetails();
                    }
                    else {
                        this.editMode = false;
                    }
                });
            }, (err) => {
                console.log(err);
            });
        }
        clientListChange(event) {
            console.log(event);
        }
        handleSelectChange(event) {
            let id = event.target.id;
            let value = event.target.value;
            // console.log(id, value);
            if (id == "datepicker") {
                let date = new Date(value);
                console.log(date.getFullYear(), date.getMonth(), date.getDate());
                console.log(date.getFullYear());
                console.log(date.getMonth() + 1 < 10
                    ? "0" + Number(date.getMonth() + 1)
                    : date.getMonth() + 1);
                console.log(date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let dateString = `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
                console.log(dateString);
                this.form.controls.arrival_date.setValue(dateString);
                $("#datepicker").val(dateString);
                // let val = new Date(date.getFullYear(),date.getMonth()<10?"0"+date.getMonth():date.getMonth(),date.getDate());
                // console.log(val.toISOString())
                // console.log(new Date(date).toISOString())
                // this.form.controls.arrival_date.setValue(new Date(value).toISOString().split['T'][0]);
                // $("#datepicker").val(new Date(value).toISOString().split["T"][0]);
            }
            // id == "datepicker" ? this.form.controls.arrival_date.setValue(new Date(value).toISOString().split['T'][0]): null;
            id == "product_apparel_source_1"
                ? this.form.controls.product_apparel_source_1.setValue(value)
                : null;
            id == "product_apparel_source_2"
                ? this.form.controls.product_apparel_source_2.setValue(value)
                : null;
            id == "product_apparel_source_3"
                ? this.form.controls.product_apparel_source_3.setValue(value)
                : null;
            id == "product_apparel_source_4"
                ? this.form.controls.product_apparel_source_4.setValue(value)
                : null;
            id == "product_apparel_source_5"
                ? this.form.controls.product_apparel_source_5.setValue(value)
                : null;
            id == "other_size_1_1"
                ? this.form.controls.other_size_1_1.setValue(value)
                : null;
            id == "other_size_1_2"
                ? this.form.controls.other_size_1_2.setValue(value)
                : null;
            id == "other_size_1_3"
                ? this.form.controls.other_size_1_3.setValue(value)
                : null;
            id == "other_size_1_4"
                ? this.form.controls.other_size_1_4.setValue(value)
                : null;
            id == "other_size_1_5"
                ? this.form.controls.other_size_1_5.setValue(value)
                : null;
            id == "other_size_2_1"
                ? this.form.controls.other_size_2_1.setValue(value)
                : null;
            id == "other_size_2_2"
                ? this.form.controls.other_size_2_2.setValue(value)
                : null;
            id == "other_size_2_3"
                ? this.form.controls.other_size_2_3.setValue(value)
                : null;
            id == "other_size_2_4"
                ? this.form.controls.other_size_2_4.setValue(value)
                : null;
            id == "other_size_2_5"
                ? this.form.controls.other_size_2_5.setValue(value)
                : null;
            id == "other_size_3_1"
                ? this.form.controls.other_size_3_1.setValue(value)
                : null;
            id == "other_size_3_2"
                ? this.form.controls.other_size_3_2.setValue(value)
                : null;
            id == "other_size_3_3"
                ? this.form.controls.other_size_3_3.setValue(value)
                : null;
            id == "other_size_3_4"
                ? this.form.controls.other_size_3_4.setValue(value)
                : null;
            id == "other_size_3_5"
                ? this.form.controls.other_size_3_5.setValue(value)
                : null;
            id == "other_size_4_1"
                ? this.form.controls.other_size_4_1.setValue(value)
                : null;
            id == "other_size_4_2"
                ? this.form.controls.other_size_4_2.setValue(value)
                : null;
            id == "other_size_4_3"
                ? this.form.controls.other_size_4_3.setValue(value)
                : null;
            id == "other_size_4_4"
                ? this.form.controls.other_size_4_4.setValue(value)
                : null;
            id == "other_size_4_5"
                ? this.form.controls.other_size_4_5.setValue(value)
                : null;
            id == "shippingMethod"
                ? this.form.controls.ship_type.setValue(value)
                : null;
            if (id == "clientList") {
                this.form.controls.customer_id.setValue(value);
                if (this.form.controls.customer_id.value) {
                    let client = this.clientList.filter((client) => {
                        if (client.id == this.form.controls.customer_id.value) {
                            return client;
                        }
                    })[0];
                    console.log(client);
                    this.form.controls.customer_name.setValue(this.form.controls.customer_name.value ||
                        client.first_name + " " + client.last_name);
                    this.form.controls.customer_address_2.setValue(this.form.controls.customer_address_2.value || client.shipping_city);
                    this.form.controls.customer_address.setValue(this.form.controls.customer_address.value ||
                        client.shipping_address + " " + client.shipping_street_appartment);
                    this.form.controls.customer_state.setValue(this.form.controls.customer_state.value || client.state);
                    this.form.controls.customer_zipcode.setValue(this.form.controls.customer_zipcode.value || client.zipcode);
                    this.form.controls.customer_email.setValue(this.form.controls.customer_email.value || client.email);
                    this.form.controls.customer_phone.setValue(this.form.controls.customer_phone.value || client.shipping_phone);
                }
            }
            // id == "clientList" ? this.form.controls.customer_id.setValue(value) : null;
            id == "orderType" ? this.form.controls.type.setValue(value) : null;
            id == "arrivalTime"
                ? this.form.controls.arrival_type.setValue(value)
                : null;
            id == "color_1" ? this.form.controls.color_1.setValue(value) : null;
            id == "color_2" ? this.form.controls.color_2.setValue(value) : null;
            id == "color_3" ? this.form.controls.color_3.setValue(value) : null;
            id == "color_4" ? this.form.controls.color_4.setValue(value) : null;
            id == "color_5" ? this.form.controls.color_5.setValue(value) : null;
            id == "color_6" ? this.form.controls.color_6.setValue(value) : null;
            if (id.indexOf("color_") > -1) {
                $("#" + id).css("color", value);
            }
            if (id == "orderType" && value == "order_others") {
                this.showOrderOthers = true;
            }
            else {
                this.showOrderOthers = false;
                this.form.controls.type_other.setValue("");
            }
            if (id == "apparelSource" && value == "apparel_others") {
                this.showApparelOthers = true;
            }
            else {
                this.showApparelOthers = false;
            }
            if (id == "arrivalTime" && value == "arrival_others") {
                this.showArrivalOthers = true;
            }
            else {
                this.showArrivalOthers = false;
                this.form.controls.arrival_other.setValue("");
            }
            if (id == "shippingMethod" && value == "shipping_others") {
                this.showShippingOthers = true;
            }
            else {
                this.showShippingOthers = false;
                this.form.controls.ship_notes.setValue("");
            }
        }
        handleFileSelect(event, controlName) {
            this.form.controls[controlName].setValue(event.target.files[0]);
            // console.log(event.target.files[0])
            if (controlName === "shipping_label_url" ||
                controlName === "packing_list_url") {
                $(`#${controlName}`).text(event.target.files[0].name);
            }
            else {
                let reader = new FileReader();
                reader.onload = function (e) {
                    $(`#${controlName}`).css("background-image", `url(${e.target.result})`);
                };
                reader.readAsDataURL(event.target.files[0]); // convert to base64 string
            }
        }
        handleMultiFileSelect(event, controlName) {
            console.log(event.target.files);
            let f = Array.from(event.target.files);
            this.files = this.files.concat(f);
            // this.files = [...f];
            console.log(this.files);
            // this.form.controls.artfile.setValue(event.target.files);
            // console.log(event.target.files[0])
            // for (let index = 0; index < this.files.length; index++) {
            //       let reader = new FileReader();
            //       reader.onload = function (e) {
            //         // let image:any = new Image();
            //         // image.src = e.target.result;
            //         $("#art-images").append(
            //           `<li><img src="${e.target.result}" style="height: 280px; object-fit: contain; width: 100%;"></li>`
            //         );
            //         // $(`#${controlName}`).css("background-image", `url(${e.target.result})`);
            //       };
            //   reader.readAsDataURL(this.files[index]);
            // }
            setTimeout(() => {
                this.recreateSlider("art-images-temp");
            }, 0);
        }
        recreateSlider(id) {
            if ($("#" + id).hasClass("slick-initialized")) {
                $("#" + id).slick("destroy");
                $("#" + id).slick(this.getSlickSettings());
                // $("#" + id).slick("refresh");
            }
            else {
                $("#" + id).slick(this.getSlickSettings());
                // $("#" + id).slick("refresh");
            }
        }
        getSlickSettings() {
            return {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                centerPadding: "0",
                centerMode: true,
                slide: "li",
                fade: false,
                dots: false,
                speed: 100,
                infinite: false,
            };
        }
        deleteImage(id, order_id) {
            this.orderService.deleteArtImage(id, order_id).subscribe((data) => {
                console.log(data);
                location.reload(true);
            }, (err) => console.log(err));
        }
        deleteTempFile(i) {
            // console.log(i);
            let arr = Array.from(this.files);
            arr.splice(i, 1);
            this.files = arr;
            $("#art-images-temp").slick("slickRemove", $("#art-images-temp").slick("slickCurrentSlide"), false);
            // let index = Number($("#art-images-temp .slick-current").attr("data-slick-index"));
            // $("#art-images-temp").slick("slickRemove", index,false);
            // $("#art-images-temp").empty();
            // $(`li:eq(${i})`, $("#art-images-temp")).remove();
            // this.recreateSlider("art-images-temp");
            setTimeout(() => {
                // $("#art-images-temp").on("afterChange", function () {
                //   var dataId = $(".slick-current").attr("data-slick-index");
                //   console.log(dataId);
                // });
                // let index = $("#art-images-temp .slick-current .slick-active").index();
                // console.log(index);
                // $("#art-images-temp").slick("refresh");
                // console.log(this.files);
            }, 0);
        }
        getNearestPantone(hex) {
            let res = pantone.getClosestColor(hex);
            return res.name + " " + res.pantone;
        }
        toggleOverlay() {
            this.overlayToggled = !this.overlayToggled;
        }
        handleCancel() {
            $("#dialog-content").text("All of your unsaved changes will be lost, are you sure?");
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
                        this.router.navigate(["/login"]);
                    },
                    No: () => {
                        $(".ui-dialog-content").dialog("close");
                    },
                },
            });
        }
    };
    __decorate([
        HostListener("window:beforeunload", ["$event"])
    ], AddOrderComponent.prototype, "doSomething", null);
    AddOrderComponent = __decorate([
        Component({
            selector: "app-add-order",
            templateUrl: "./add-order.component.html",
            styleUrls: ["./add-order.component.css"],
        })
    ], AddOrderComponent);
    return AddOrderComponent;
})();
export { AddOrderComponent };
//# sourceMappingURL=add-order.component.js.map