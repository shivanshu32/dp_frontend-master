import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
let UserService = /** @class */ (() => {
    let UserService = class UserService {
        constructor(authService, http) {
            this.authService = authService;
            this.http = http;
        }
        getUserList() {
            return this.http.get(`${environment.baseUrl}/admin/users/list`, this.authService.getAuthHeaders());
        }
        createUser(userObj) {
            return this.http.post(`${environment.baseUrl}/admin/users/create`, userObj, this.authService.getAuthHeaders());
        }
        getUserDetails(id) {
            return this.http.get(`${environment.baseUrl}/admin/users/${id}/details`, this.authService.getAuthHeaders());
        }
        updateUser(id, userObj) {
            return this.http.post(`${environment.baseUrl}/admin/users/${id}/update`, userObj, this.authService.getAuthHeaders());
        }
        deleteSingleUser(id) {
            return this.http.get(`${environment.baseUrl}/admin/users/${id}/delete`, this.authService.getAuthHeaders());
        }
        updateUserStatus(userId) {
            return this.http.get(`${environment.baseUrl}/admin/users/${userId}/status`, this.authService.getAuthHeaders());
        }
    };
    UserService = __decorate([
        Injectable({
            providedIn: "root",
        })
    ], UserService);
    return UserService;
})();
export { UserService };
//# sourceMappingURL=user.service.js.map