import { formatDate } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { OrderService } from "../../services/order.service";
import { UtilService } from "src/app/services/util.service";
declare var $: any;
import * as pantone from "nearest-pantone";
import { NotifierService } from "angular-notifier";
import { environment } from "../../../environments/environment"

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: "app-add-order",
  templateUrl: "./add-order.component.html",
  styleUrls: ["./add-order.component.css"],
})
export class AddOrderComponent implements OnInit {
  clientList = [];
  orderTypes = [];
  user: any = {};
  isLoading = false;
  film_file = "";
  params = {view: 'default'};
  orderWasCreated = false;
  qrIDString = "";
  qrURLString = "";
  qrURLShippingString = "";
  orderId = "";
  orderName = "";
  orderData = {data: {order_key: ''}};
  formObj = {
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
    film: [false],
    art_notes: [""],
    order_arts: [[]],
    color_1: ["#333333"],
    color_1_pantone: ["", [Validators.maxLength(20)]],
    color_2: ["#333333"],
    color_2_pantone: ["", [Validators.maxLength(20)]],
    color_3: ["#333333"],
    color_3_pantone: ["", [Validators.maxLength(20)]],
    color_4: ["#999999"],
    color_4_pantone: ["", [Validators.maxLength(20)]],
    color_5: ["#999999"],
    color_5_pantone: ["", [Validators.maxLength(20)]],
    color_6: ["#999999"],
    color_6_pantone: ["", [Validators.maxLength(20)]],
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
    invoice_number: [""],
    customer_address: [""],
    customer_state: [""],
    customer_zipcode: [""],
    customer_email: ["", [Validators.email]],
    customer_phone: [""],
    weight: [""],
    boxes: [""],
    shipping_label_url: [""],
    packing_list_url: [""],
    setup_name: [""],
    setup_screen_1: [""],
    setup_screen_2: [""],
    setup_notes: [""],
    proof_url: [""],
    proof_notes: [""],
    position_front: ["", [Validators.maxLength(20)]],
    position_back: ["", [Validators.maxLength(20)]],
    position_right_left: ["", [Validators.maxLength(20)]],
    position_additional: ["", [Validators.maxLength(20)]],
    position_notes: [""],
    color_notes: [""],
    customer_address_2: [""],
    multiple_pages: [false],
    match_proof_position: [false],
    match_proof_color: [false],
  };

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notifier: NotifierService,
    private utilService: UtilService
  ) {
    this.user = this.authService.getLocalUser();
    this.orderTypes = this.utilService.getOrderTypes();
  }

  //@HostListener("window:beforeunload", ["$event"])
  // doSomething($event) {
  //   if(this.orderWasCreated){
  //     return false;
  //   }
  //   $event.returnValue = "Your data will be lost!";
  // }

  editMode = false;
  order_id = 0;
  ngOnInit(): void {

    this.isLoading = true;

    this.route.queryParams.subscribe((data) => {
      var newData = {view: 'default'};
      for(var i in data){
        newData[i] = data[i];
      }
      
      this.params.view = newData.view;
    });


    this.initForm();

  }

  addOrder() {
    this.form.markAllAsTouched();

    console.log(this.form);

    if (this.form.invalid) {
      this.notifier.notify(
        "error",
        "Please check the errors before submitting"
      );
      return false;
    }

    

    this.form.controls.product_user_type_1.setValue(
      $("#product_user_type_1").val()
        ? $("#product_user_type_1").val().toString()
        : ""
    );
    this.form.controls.product_user_type_2.setValue(
      $("#product_user_type_2").val()
        ? $("#product_user_type_2").val().toString()
        : ""
    );
    this.form.controls.product_user_type_3.setValue(
      $("#product_user_type_3").val()
        ? $("#product_user_type_3").val().toString()
        : ""
    );
    this.form.controls.product_user_type_4.setValue(
      $("#product_user_type_4").val()
        ? $("#product_user_type_4").val().toString()
        : ""
    );
    this.form.controls.product_user_type_5.setValue(
      $("#product_user_type_5").val()
        ? $("#product_user_type_5").val().toString()
        : ""
    );

    if (this.form.controls.proof_url.value instanceof File) {
    } else {
      this.form.controls.proof_url.setValue("");
    }

    if (this.form.controls.packing_list_url.value instanceof File) {
    } else {
      this.form.controls.packing_list_url.setValue("");
    }

    if (this.form.controls.shipping_label_url.value instanceof File) {
    } else {
      this.form.controls.shipping_label_url.setValue("");
    }

    for (let main = 1; main <= 4; main++) {
      for (let index = 1; index <= 5; index++) {
        if (this.form.controls[`other_size_${main}_${index}`].value) {
          if (!this.form.controls[`pcs_${main}_${index}`].value) {
            this.form.controls[`pcs_${main}_${index}`].setErrors({
              required: true,
            });
          }
        }
      }
    }

    if (this.form.invalid) {
      this.notifier.notify("error", "Please check the errors before submitting");
      this.form.markAllAsTouched();
      return false;
    } else {
      this.isLoading = true;
      let formData = new FormData();
      Object.keys(this.form.controls).forEach((controls) => {
        formData.append(controls, this.form.controls[controls].value);
      });

      if (this.files.length > 0) {
        for (let index = 0; index < this.files.length; index++) {
          formData.append("artfile[]", this.files[index]);
        }
      }

      var orderName = $("input[formcontrolname=name]").val();

      console.log(orderName);

      document.body.scrollTo(0, 0);
      if (this.editMode) {
        //update the order
        this.orderService.updateOrder(this.order_id, formData).subscribe(
          (data: any) => {
            this.isLoading = false;
            if (data.code == 200) {
              this.notifier.notify("success", "Order Updated");
              setTimeout(function(){
                  window.parent['$']("#createOrderDialog").modal('hide');
              },500);
            }else{
              this.notifier.notify("error", data.message);
              this.isLoading = false;
            }
          },
          (err) => {
            this.isLoading = false;
            this.notifier.notify("error", "An error ocurred. Please try again.");
          }
        );
      } else {

        window.parent.onbeforeunload = function(evt) {
           return true;
        }

        this.orderService.createOrder(formData).subscribe(
          (data: any) => {
            if (data.code == 200) {

              window.parent['$']("#createOrderDialog .close").css('display','none');

              this.orderData = data;
              var id = this.orderData.data.order_key;

              this.qrIDString = `${environment.baseFEUrl}/administrator?title=${id}`;
              this.qrURLString = `${environment.baseFEUrl}/order-details?id=${id}`;
              this.qrURLShippingString = `${environment.baseFEUrl}/shipping?id=${id}`;
              this.orderId = id;
              this.orderName = name;



              $("#qrCodeDialog").modal({
                keyboard: false,
                backdrop: false
              });

              var parentContext = this;

              
              var isOver30Characters = (orderName.length > 20);
              orderName = orderName.substr(0,20);
              if(isOver30Characters){
                  orderName += "...";
              }

              $("#order_name").text(orderName);

              setTimeout(function(){

               let DATA = document.getElementById('pdfContainer');

               

               html2canvas(DATA).then((canvas) => {

                  try {
                    let fileWidth = 195;
                    let fileHeight = canvas.height * fileWidth / canvas.width;
                    const FILEURI = canvas.toDataURL('image/png');
                    let PDF = new jsPDF('l', 'mm', 'a5');
                    let position = 10;
                    
                    

                      PDF.addImage(FILEURI, 'PNG', 7, position, fileWidth, fileHeight+10);

                      let actualFile = new File([PDF.output('blob')], "file");

                      var formData = new FormData();                  

                      formData.append("file",actualFile);

                      parentContext.orderService.createQRCode(parentContext.orderData.data.order_key, formData).subscribe( (data: any) => {

                        parentContext.isLoading = false;
                        parentContext.orderWasCreated = true;

                        parentContext.notifier.notify("success","Order Created!");

                        setTimeout(function(){

                          switch(parentContext.params.view){
                            case "modal":
                              window.parent['$']("#createOrderDialog").css('z-index','-1');
                              window.parent['$']("body").removeClass('modal-open');
                              window.parent['$'](".modal-backdrop").detach();
                              window.parent.location.reload();

                            break;
                            case "default":
                            default:
                              parentContext.router.navigate(["/"]);
                            break;
                          }

                        },1000);

                      }, (err) => {
                        switch(parentContext.params.view){
                          case "modal":

                            //window.parent.location.reload();
                            
                          break;
                          case "default":
                          default:
                            parentContext.router.navigate(["/"]);
                          break;
                        }
                      });


                    

                    

                  } catch(error){
                    console.log(error);
                  }
                         


                  }); 

                },1000);        
              
            }else{
              this.notifier.notify("error", data.message);
              this.isLoading = false;
            }
          },
          (err) => {
            this.notifier.notify("error", err.message);
            this.isLoading = false;
            console.log(err);
          }
        );
      }
    }
  }

  form: FormGroup;
  productArr = [];
  productArrGrouped = [];
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

    this.isLoading = false;
    ///////////////////////////////// 

    var thisContext = this;

    $('.section-wrap').addClass('noopacity');

    setTimeout(function(){

      if(!thisContext.editMode && thisContext.user.role === 'Customer'){

        thisContext.form.controls.customer_id.setValue('-1');

        thisContext.form.controls.customer_name.setValue(
          thisContext.user.first_name + " " + thisContext.user.last_name
        );
        thisContext.form.controls.customer_address_2.setValue(
          thisContext.user.shipping_city
        );
        thisContext.form.controls.customer_address.setValue(
          thisContext.user.address
        );
        thisContext.form.controls.customer_state.setValue(
          thisContext.user.state
        );
        thisContext.form.controls.customer_zipcode.setValue(
          thisContext.user.shipping_zipcode
        );
        thisContext.form.controls.customer_email.setValue(
          thisContext.user.email
        );
        thisContext.form.controls.customer_phone.setValue(
          thisContext.user.shipping_phone
        );

      }else{
        $("#client_select_form").on('keyup',thisContext.delay(thisContext.clientSelectWrap,500).bind(thisContext));        
      }

      thisContext.initAllDropdowns();

      $('.section-wrap').removeClass('noopacity');

      thisContext.route.queryParams.subscribe((data) => {

        this.params = data;

        if (data.id) {
          thisContext.order_id = data.id;
          thisContext.editMode = true;
          thisContext.getOrderDetails();

        } else {
          thisContext.editMode = false;
        }
      });

      



    }, 750);
    
  }

  delay(fn, ms) {
    let timer = 0
    return function(...args) {
      clearTimeout(timer)
      timer = setTimeout(fn.bind(this, ...args), ms || 0)
    }
  }

  getOrderDetails() {
    this.orderService.getOrderDetails(this.order_id).subscribe(
      (data: any) => {
        console.log(data);
        if (data.data) {

           data.data.proof_url = !/^http/.test(data.data.proof_url) && typeof data.data.proof_url === 'string' ?

              environment.awsURL + data.data.proof_url
              :
              data.data.proof_url
              ;

              data.data.file_url = !/^http/.test(data.data.file_url) && typeof data.data.file_url === 'string' ?

              environment.awsURL + data.data.file_url
              :
              data.data.file_url
              ;




          this.film_file = data.data.film_file;
            this.film_file = !/^http/.test(this.film_file) && typeof this.film_file === 'string' ?

          environment.awsURL + this.film_file
          :
          this.film_file
          ;

          for(var k in data.data.order_arts){

              data.data.order_arts[k].file_url = !/^http/.test(data.data.order_arts[k].file_url) && typeof data.data.order_arts[k].file_url === 'string' ?

                environment.awsURL + data.data.order_arts[k].file_url
                :
                data.data.order_arts[k].file_url
                ;

          }
          $("#client_name").val(data.data.customer_name);
          $("#clientList").prop("disabled", true);
          this.editMode = true;
          $("input[placeholder=PCS]").removeAttr('disabled');
          Object.keys(data.data).forEach((control) => {
            // console.log(control, data.data[control]);
            try {
              this.form.controls[control].setValue(
                data.data[control] == null ||
                  data.data[control] == undefined ||
                  data.data[control] == "undefined" ||
                  data.data[control] == "null"
                  ? ""
                  : data.data[control]
              );

              if (control.indexOf("product_user_type_") > -1) {
                $("#" + control)
                  .val(
                    data.data[control] == null ||
                      data.data[control] == undefined ||
                      data.data[control] == "undefined" ||
                      data.data[control] == "null"
                      ? ""
                      : data.data[control].split(",")
                  )
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
            } catch (error) {
              // console.log(control, "not found in the form");
            }
          });

          if(data.data.shipping_label_url === null){
            data.data.shipping_label_url = '';
          }

          var urls = data.data.shipping_label_url.split('\n');

          var listToDisplay = "";

          for(var i in urls){
              if(urls[i].length > 10){

                  listToDisplay +=  /^http/.test(urls[i]) ? urls[i] : environment.awsURL + urls[i] + "\n";

              }
          }

          $("#shipping_label_displays").val(listToDisplay);

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
        } else {
          this.editMode = false;
        }





      },
      (err) => {
        console.log(err);
      }
    );
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

    // mm - dd - yy;
    $("#datepicker").datepicker();
    $(".ui-datepicker").addClass("notranslate");

    $("select[formcontrolname^='pcs_'],select[formcontrolname^='other_size_']").on('select2:select',function(){

    });

    $("#color_1").spectrum({ type: "text" });
    $("#color_2").spectrum({ type: "text" });
    $("#color_3").spectrum({ type: "text" });
    $("#color_4").spectrum({ type: "text" });
    $("#color_5").spectrum({ type: "text" });
    $("#color_6").spectrum({ type: "text" });

    setTimeout(() => {
      $("#color_1,#color_2,#color_3,#color_4,#color_5,#color_6").trigger(
        "change"
      );
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
      draggable: false,
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

    $(
      "#datepicker,#other_size_4_1,#other_size_4_2,#other_size_4_3,#other_size_4_4,#other_size_4_5,#other_size_3_1,#other_size_3_2,#other_size_3_3,#other_size_3_4,#other_size_3_5,#other_size_2_1,#other_size_2_2,#other_size_2_3,#other_size_2_4,#other_size_2_5,#orderType,#other_size_1_1,#other_size_1_2,#other_size_1_3,#other_size_1_4,#other_size_1_5,#product_apparel_source_1,#product_apparel_source_2,#product_apparel_source_3,#product_apparel_source_4,#product_apparel_source_5,#arrivalTime,#shippingMethod,#clientList,#color_1,#color_2,#color_3,#color_4,#color_5,#color_6"
    ).on("change", (event) => {
      this.handleSelectChange(event);
      $(event.target).parent().parent().next().next().find("input").removeAttr('disabled')
    });

    // $(".select2-search, .select2-focusser").remove();
    this.isLoading = false;
  }

  clientSelectWrap(event){
      //event function
      var query = $(event.target).val();
      this.getClientsList(query, function(data, parentContext){
          if($("#client_list").attr('aria-expanded') !== 'true'){

              $("#client_selector button").trigger('click');
          }

          $("#list_of_clients").empty();

          var currentlySelectedId = $("#clientList").val();

          for(var i in data.data){
              var dt = data.data[i];
              var isSelectedClause = (currentlySelectedId+"" === dt.id+"") ? " active" : "";
              $("#list_of_clients").append("\
                <a href='javascript:' class='dropdown-item' customer_id='"+ dt.id +"'>"+ dt.first_name +" "+ dt.last_name +" ("+ dt.email +")</a>\
                ");
          }


          $("#list_of_clients a:not(.active)").on('click', function(event){
              var id = $(this).attr('customer_id');

              $("#list_of_clients .active").removeClass('active');
              $(this).addClass('active');

              var text = $(this).text();
              $("#client_select_form").val(text);



            parentContext.form.controls.customer_id.setValue(id);
            if (parentContext.form.controls.customer_id.value) {
              let client = parentContext.clientList.filter((client) => {
                if (client.id == parentContext.form.controls.customer_id.value) {
                  return client;
                }
              })[0];


              if (parentContext.editMode) {
                parentContext.form.controls.customer_name.setValue(
                  parentContext.form.controls.customer_name.value
                );
                parentContext.form.controls.customer_address_2.setValue(
                  parentContext.form.controls.customer_address_2.value
                );
                parentContext.form.controls.customer_address.setValue(
                  parentContext.form.controls.customer_address.value
                );
                parentContext.form.controls.customer_state.setValue(
                  parentContext.form.controls.customer_state.value
                );
                parentContext.form.controls.customer_zipcode.setValue(
                  parentContext.form.controls.customer_zipcode.value
                );
                parentContext.form.controls.customer_email.setValue(
                  parentContext.form.controls.customer_email.value
                );
                parentContext.form.controls.customer_phone.setValue(
                  parentContext.form.controls.customer_phone.value
                );
                parentContext.form.controls.customer_attn.setValue(
                  parentContext.form.controls.customer_attn.value
                );
              } else {

                parentContext.form.controls.customer_name.setValue(
                  `${client.first_name ? client.first_name : ""} ${
                    client.last_name ? client.last_name : ""
                  }`
                );
                parentContext.form.controls.customer_attn.setValue(
                  `${client.company ? client.company : ""}`
                );

                parentContext.form.controls.customer_address_2.setValue("");
                parentContext.form.controls.customer_address_2.setValue(
                  parentContext.form.controls.customer_address_2.value || client.shipping_city
                    ? client.shipping_city
                    : ""
                );
                parentContext.form.controls.customer_address.setValue("");
                parentContext.form.controls.customer_address.setValue(
                  parentContext.form.controls.customer_address.value ||
                    `${client.shipping_address} ${
                      client.shipping_street_appartment
                    } ${
                      !client.shipping_street_appartment && !client.shipping_address
                        ? client.address
                        : ""
                    }`
                );

                parentContext.form.controls.customer_state.setValue("");
                parentContext.form.controls.customer_state.setValue(
                  parentContext.form.controls.customer_state.value || client.state
                    ? client.state
                    : ""
                );
                parentContext.form.controls.customer_zipcode.setValue("");
                parentContext.form.controls.customer_zipcode.setValue(
                  parentContext.form.controls.customer_zipcode.value || client.zipcode
                    ? client.zipcode
                    : ""
                );
                parentContext.form.controls.customer_email.setValue("");
                parentContext.form.controls.customer_email.setValue(
                  parentContext.form.controls.customer_email.value || client.email
                    ? client.email
                    : ""
                );
                parentContext.form.controls.customer_phone.setValue("");
                parentContext.form.controls.customer_phone.setValue(
                  parentContext.form.controls.customer_phone.value || client.shipping_phone
                    ? client.shipping_phone
                    : ""
                );
              }
            }


          });

      });
  }

  getClientsList(query = null, thingsToDo = function(a,b){}) {
    this.orderService.getClientList(query).subscribe(
      (data: any) => {
        this.clientList = data.data;
        if(typeof thingsToDo === 'function'){
          try {
            thingsToDo(data,this);
          }catch(error){
            console.log('Failed to get list of clients.');
          }

        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  clientListChange(event) {
    console.log(event);
  }

  showOrderOthers = false;
  showApparelOthers = false;
  showArrivalOthers = false;
  showShippingOthers = false;
  showApparelOthers_1 = false;
  showApparelOthers_2 = false;
  showApparelOthers_3 = false;
  showApparelOthers_4 = false;
  showApparelOthers_5 = false;
  handleSelectChange(event) {
    let id = event.target.id;
    let value = event.target.value;
    console.log(id, value);

    if (id == "datepicker") {
      let date = new Date(value);
      console.log(date.getFullYear(), date.getMonth(), date.getDate());
      console.log(date.getFullYear());
      console.log(
        date.getMonth() + 1 < 10
          ? "0" + Number(date.getMonth() + 1)
          : date.getMonth() + 1
      );
      console.log(date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

      let month = date.getMonth() + 1;
      let day = date.getDate();
      let dateString = `${date.getFullYear()}-${
        month < 10 ? "0" + month : month
      }-${day < 10 ? "0" + day : day}`;
      console.log(dateString);

      this.form.controls.arrival_date.setValue(dateString);
      $("#datepicker").val(dateString);
      $(".ui-datepicker").addClass("notranslate");

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

      console.log('it went here');

    if (id == "clientList") {
      console.log(this);
      this.form.controls.customer_id.setValue(value);
      if (this.form.controls.customer_id.value) {
        let client = this.clientList.filter((client) => {
          if (client.id == this.form.controls.customer_id.value) {
            return client;
          }
        })[0];
        console.log(client);

        if (this.editMode) {
          this.form.controls.customer_name.setValue(
            this.form.controls.customer_name.value
          );
          this.form.controls.customer_address_2.setValue(
            this.form.controls.customer_address_2.value
          );
          this.form.controls.customer_address.setValue(
            this.form.controls.customer_address.value
          );
          this.form.controls.customer_state.setValue(
            this.form.controls.customer_state.value
          );
          this.form.controls.customer_zipcode.setValue(
            this.form.controls.customer_zipcode.value
          );
          this.form.controls.customer_email.setValue(
            this.form.controls.customer_email.value
          );
          this.form.controls.customer_phone.setValue(
            this.form.controls.customer_phone.value
          );
          this.form.controls.customer_attn.setValue(
            this.form.controls.customer_attn.value
          );
        } else {
          // this.form.controls.customer_name.setValue("");
          this.form.controls.customer_name.setValue(
            `${client.first_name ? client.first_name : ""} ${
              client.last_name ? client.last_name : ""
            }`
          );
          this.form.controls.customer_attn.setValue(
            `${client.company ? client.company : ""}`
          );
          // this.form.controls.customer_name.setValue(
          //   this.form.controls.customer_name.value || client.first_name
          //     ? client.first_name
          //     : "" + " " + client.last_name
          //     ? client.last_name
          //     : ""
          // );
          this.form.controls.customer_address_2.setValue("");
          this.form.controls.customer_address_2.setValue(
            this.form.controls.customer_address_2.value || client.shipping_city
              ? client.shipping_city
              : ""
          );
          this.form.controls.customer_address.setValue("");
          this.form.controls.customer_address.setValue(
            this.form.controls.customer_address.value ||
              `${client.shipping_address} ${
                client.shipping_street_appartment
              } ${
                !client.shipping_street_appartment && !client.shipping_address
                  ? client.address
                  : ""
              }`
          );
          // this.form.controls.customer_address.setValue(
          //   this.form.controls.customer_address.value || client.shipping_address
          //     ? client.shipping_address
          //     : "" + " " + client.shipping_street_appartment
          //     ? client.shipping_street_appartment
          //     : ""
          // );
          this.form.controls.customer_state.setValue("");
          this.form.controls.customer_state.setValue(
            this.form.controls.customer_state.value || client.state
              ? client.state
              : ""
          );
          this.form.controls.customer_zipcode.setValue("");
          this.form.controls.customer_zipcode.setValue(
            this.form.controls.customer_zipcode.value || client.zipcode
              ? client.zipcode
              : ""
          );
          this.form.controls.customer_email.setValue("");
          this.form.controls.customer_email.setValue(
            this.form.controls.customer_email.value || client.email
              ? client.email
              : ""
          );
          this.form.controls.customer_phone.setValue("");
          this.form.controls.customer_phone.setValue(
            this.form.controls.customer_phone.value || client.shipping_phone
              ? client.shipping_phone
              : ""
          );
        }
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
    } else {
      this.showOrderOthers = false;
      this.form.controls.type_other.setValue("");
    }

    if (id == "apparelSource" && value == "apparel_others") {
      this.showApparelOthers = true;
    } else {
      this.showApparelOthers = false;
    }

    if (id == "arrivalTime" && value == "arrival_others") {
      this.showArrivalOthers = true;
    } else {
      this.showArrivalOthers = false;
      this.form.controls.arrival_other.setValue("");
    }

    if (id == "shippingMethod" && value == "shipping_others") {
      this.showShippingOthers = true;
    } else {
      this.showShippingOthers = false;
      this.form.controls.ship_notes.setValue("");
    }
  }

  handleFileSelect(event, controlName) {
    this.form.controls[controlName].setValue(event.target.files[0]);
    // console.log(event.target.files[0])
    if (
      controlName === "shipping_label_url" ||
      controlName === "packing_list_url"
    ) {
      $(`#${controlName}`).text(event.target.files[0].name);
    } else {
      let reader = new FileReader();
      reader.onload = function (e) {
        $(`#${controlName}`).css("background-image", `url(${e.target.result})`);
      };
      reader.readAsDataURL(event.target.files[0]); // convert to base64 string
    }
  }

  files: any = [];
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
    } else {
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
      draggable: false,
      speed: 100,
      infinite: false,
    };
  }

  deleteImage(id, order_id) {
    this.orderService.deleteArtImage(id, order_id).subscribe(
      (data) => {
        console.log(data);
        location.reload(true);
      },
      (err) => console.log(err)
    );
  }

  deleteTempFile(i) {
    // console.log(i);
    let arr = Array.from(this.files);
    arr.splice(i, 1);
    this.files = arr;

    $("#art-images-temp").slick(
      "slickRemove",
      $("#art-images-temp").slick("slickCurrentSlide"),
      false
    );

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

  overlayToggled = false;
  toggleOverlay() {
    this.overlayToggled = !this.overlayToggled;
  }

  handleCancel() {
    $("#dialog-content").text(
      "All of your unsaved changes will be lost, are you sure?"
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
          if(this.params.view === 'modal'){
            window.parent['$']("#createOrderDialog").modal('hide');
          }else{
            this.router.navigate(["/login"]);
          }
          
        },
        No: () => {
          $(".ui-dialog-content").dialog("close");
        },
      },
    });
  }
}
