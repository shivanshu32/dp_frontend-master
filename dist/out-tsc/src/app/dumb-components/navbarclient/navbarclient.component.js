import { __decorate } from "tslib";
import { Component } from '@angular/core';
let NavbarclientComponent = /** @class */ (() => {
    let NavbarclientComponent = class NavbarclientComponent {
        constructor(auth) {
            this.auth = auth;
        }
        ngOnInit() {
        }
        logout() {
            this.auth.removeLocalUser();
        }
    };
    NavbarclientComponent = __decorate([
        Component({
            selector: 'app-navbarclient',
            templateUrl: './navbarclient.component.html',
            styleUrls: ['./navbarclient.component.css']
        })
    ], NavbarclientComponent);
    return NavbarclientComponent;
})();
export { NavbarclientComponent };
//# sourceMappingURL=navbarclient.component.js.map