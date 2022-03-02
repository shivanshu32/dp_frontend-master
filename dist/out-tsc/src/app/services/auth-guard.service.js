import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AuthGuardService = /** @class */ (() => {
    let AuthGuardService = class AuthGuardService {
        constructor(auth, router) {
            this.auth = auth;
            this.router = router;
        }
        canActivate(route) {
            // console.log(this.auth.isAuthenticated())
            if (this.auth.isTokenExpired() === true) {
                this.router.navigate(['/login']);
                return false;
            }
            if (!route.data.expectedRoles.includes(this.auth.getLocalUser().role)) {
                this.router.navigate(['/login']);
                return false;
            }
            return true;
        }
    };
    AuthGuardService = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], AuthGuardService);
    return AuthGuardService;
})();
export { AuthGuardService };
//# sourceMappingURL=auth-guard.service.js.map