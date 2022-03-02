import { __decorate } from "tslib";
import { Component } from "@angular/core";
let ClientComponent = /** @class */ (() => {
    let ClientComponent = class ClientComponent {
        constructor(auth) {
            this.auth = auth;
            this.user = {};
            this.user = this.auth.getLocalUser();
            console.log(this.user);
        }
        ngOnInit() {
            $(".open-menu").click(function () {
                $(".dash-head-user").addClass("active");
            });
            $(".close-menu").click(function () {
                $(".dash-head-user").removeClass("active");
            });
        }
    };
    ClientComponent = __decorate([
        Component({
            selector: "app-client",
            templateUrl: "./client.component.html",
            styleUrls: ["./client.component.css"],
        })
    ], ClientComponent);
    return ClientComponent;
})();
export { ClientComponent };
//# sourceMappingURL=client.component.js.map