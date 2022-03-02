import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  jwtHelper = new JwtHelperService();

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(userObj) {
    return this.httpClient.post(
      `${environment.baseUrl}/login`,
      userObj,
      this.withoutAuthHeader
    );
  }

  forgotPassword(userObj) {
    return this.httpClient.post(
      `${environment.baseUrl}/forgot`,
      userObj,
      this.withoutAuthHeader
    );
  }

  recoverPassword(passwordObj) {
    return this.httpClient.post(
      `${environment.baseUrl}/recover`,
      passwordObj,
      this.withoutAuthHeader
    );
  }

  getProfileData() {
    return this.httpClient.get(
      `${environment.baseUrl}/user`,
      this.getAuthHeaders()
    );
  }

  updateProfileData(userObj) {
    return this.httpClient.post(
      `${environment.baseUrl}/update-profile`,
      userObj,
      this.getAuthHeaders()
    );
  }

  updateProfileShippingData(userObj) {
    return this.httpClient.post(
      `${environment.baseUrl}/update-shipping`,
      userObj,
      this.getAuthHeaders()
    );
  }

  updatePassword(passwordObj) {
    return this.httpClient.post(
      `${environment.baseUrl}/update-password`,
      passwordObj,
      this.getAuthHeaders()
    );
  }

  getAuthHeaders() {
    let authToken = `Bearer ${localStorage.getItem("access_token")}`;
    authToken = authToken.replace(`"`, "");
    authToken = authToken.replace(`"`, "");
    return {
      headers: new HttpHeaders()
        .set("Authorization", authToken)
        .set("Content-Type", []),
    };
  }

  withoutAuthHeader: any = {
    headers: new HttpHeaders().set("Content-Type", []),
  };

  getLocalUser() {
    if (localStorage.getItem("user")) {
      return JSON.parse(localStorage.getItem("user"));
    } else {
      return null;
    }
  }

  storeLocalUser(userObj) {
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("access_token", userObj.access_token);
  }

  removeLocalUser() {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.clear();
    this.router.navigate(["/login"]);
    return false;
  }

  isTokenExpired() {
    return this.jwtHelper.isTokenExpired(localStorage.getItem("access_token"));
  }
}
