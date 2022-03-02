import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth:AuthService, private router:Router) { }

  canActivate(route:ActivatedRouteSnapshot): boolean{
    // console.log(this.auth.isAuthenticated())
    if(this.auth.isTokenExpired() === true){
      this.router.navigate(['/login']);
      return false;
    }
    if(!route.data.expectedRoles.includes(this.auth.getLocalUser().role)){
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
