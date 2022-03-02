import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  getUserList(query = null) {
    var url = query !== null ? `${environment.baseUrl}/admin/users/list?`+query : `${environment.baseUrl}/admin/users/list`
    return this.http.get(
      url,
      this.authService.getAuthHeaders()
    );
  }

  createUser(userObj) {
    return this.http.post(
      `${environment.baseUrl}/admin/users/create`,
      userObj,
      this.authService.getAuthHeaders()
    );
  }

  getUserDetails(id) {
    return this.http.get(
      `${environment.baseUrl}/admin/users/${id}/details`,
      this.authService.getAuthHeaders()
    );
  }

  updateUser(id, userObj) {
    return this.http.post(
      `${environment.baseUrl}/admin/users/${id}/update`,
      userObj,
      this.authService.getAuthHeaders()
    );
  }

  deleteSingleUser(id) {
    return this.http.get(
      `${environment.baseUrl}/admin/users/${id}/delete`,
      this.authService.getAuthHeaders()
    );
  }

  updateUserStatus(userId) {
    return this.http.get(
      `${environment.baseUrl}/admin/users/${userId}/status`,
      this.authService.getAuthHeaders()
    );
  }
}
