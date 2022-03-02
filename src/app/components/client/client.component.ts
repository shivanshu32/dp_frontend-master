import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
declare var $: any;
@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.css"],
})
export class ClientComponent implements OnInit {
  user: any = {};
  constructor(private auth: AuthService) {
    this.user = this.auth.getLocalUser();
  }
 
  ngOnInit(): void {
    var parentContext = this;
    
    $(".open-menu").click(function () {
      $(".dash-head-user").addClass("active");
    });
    $(".close-menu").click(function () {
      $(".dash-head-user").removeClass("active");
    });
  }
}
