import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user:any = {}
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.user = this.auth.getLocalUser();
    var parentContext = this;
    
    setTimeout(function(){
      if(parentContext.user.role === 'Customer'){
        $("#checklist_link").detach();
      }
    }, 1500);

    
  
  }

  logout(){
    this.auth.removeLocalUser();
  }

}
