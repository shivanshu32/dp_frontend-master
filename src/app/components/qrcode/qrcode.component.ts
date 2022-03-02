import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "src/app/services/order.service";
import { merge } from "jquery";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import * as printJS from 'print-js';

import { environment } from "../../../environments/environment"

declare var $: any;

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})

export class QRCodeComponent implements OnInit {
  user:any={};
  isLoading = false;

  qrURL = "";
  isIE11 = false;
  orderId = null;
  orderName = null;

  qrIDString = "";
  qrURLString = "";
  qrURLShippingString = "";

  constructor(private auth:AuthService, private fb:FormBuilder,private router: Router,private route: ActivatedRoute,private orderService: OrderService) {
    this.route.queryParams.subscribe((data) => {
      this.qrURL = environment.awsURL + data.order_id +"/qrcode/qr.pdf";
      this.qrIDString = `${environment.baseFEUrl}/administrator?title=${data.order_id}`;
      this.qrURLString = `${environment.baseFEUrl}/order-details?id=${data.order_id}`;
      this.qrURLShippingString = `${environment.baseFEUrl}/shipping?id=${data.order_id}`;
      this.orderId = data.order_id;
      this.orderName = data.order_name;
    });
  }

  ngOnInit(): void {
    this.user = this.auth.getLocalUser();

    var parentContext = this;

    printJS({
      printable: this.qrURL,
      type: 'pdf',
      showModal: false,
      onError: function(){

        $("#qrCodeDialog").modal({
          keyboard: false,
          backdrop: false
        });

        var orderName = parentContext.orderName;
        var isOver30Characters = (orderName.length > 20);
        orderName = orderName.substr(0,20);
        if(isOver30Characters){
            orderName += "...";
        }
        $("#order_name").text(orderName);

        console.log(orderName,$("#order_name"),$("#order_name").text());

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

                parentContext.orderService.createQRCode(parentContext.orderId, formData).subscribe( (data: any) => {

                  if(data.status){
                    printJS({
                      printable: parentContext.qrURL,
                      type: 'pdf',
                      showModal: false
                    });
                  }

                }, (err) => {
                  
                });

              } catch(error){
                console.log(error);
              }
                              

            });   

        }, 1000);

      }
    })

    
    $("#print_qr").on('click',function(){
      printJS({
        printable: parentContext.qrURL,
        type: 'pdf',
        showModal: false
      });

    });

  }

}
