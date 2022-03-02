import { __decorate } from "tslib";
import { Component } from '@angular/core';
let NavbarComponent = /** @class */ (() => {
    let NavbarComponent = class NavbarComponent {
        constructor(auth) {
            this.auth = auth;
            this.user = {};
        }
        ngOnInit() {
            this.user = this.auth.getLocalUser();
        }
        logout() {
            this.auth.removeLocalUser();
        }
    };
    NavbarComponent = __decorate([
        Component({
            selector: 'app-navbar',
            templateUrl: './navbar.component.html',
            styleUrls: ['./navbar.component.css']
        })
    ], NavbarComponent);
    return NavbarComponent;
})();
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map