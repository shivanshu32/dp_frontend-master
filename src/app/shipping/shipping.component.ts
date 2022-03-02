import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { OrderService } from '../services/order.service';

import { environment } from "../../environments/environment";

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {

  isLoading = false;

  constructor(private orderService: OrderService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id = this.route.snapshot.queryParamMap.get("id");

    this.isLoading = true;
    this.orderService.getLabelData(id).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data.code == 200) {
          for(var i in data.data){
            var dt = data.data[i];

            dt.label_url = !/^http/.test(dt.label_url) && typeof dt.label_url === 'string' ?

              environment.awsURL + dt.label_url
              :
              dt.label_url
              ;

            $("#shipping_label_list").append('<div class="card mt-2" id="sl_'+ dt.id +'">\
              <div class="card-header">'+dt.created_at+'</div>\
              <div class="card-body">\
                <iframe src="'+ dt.label_url +'" class="shipping-frame"></iframe>\
              </div>\
            </div>');
          }

        } else {
          alert(data.message);
          return false;
        }
      },
      (err) => {
        alert('Error in loading label data.');
        this.isLoading = false;
      }
    );
  }

}
