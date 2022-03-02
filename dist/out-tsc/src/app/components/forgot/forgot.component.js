import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
let ForgotComponent = /** @class */ (() => {
    let ForgotComponent = class ForgotComponent {
        constructor(fb, auth) {
            this.fb = fb;
            this.auth = auth;
            this.isLoading = false;
            this.form = this.fb.group({
                email: ['', [Validators.required, Validators.email]]
            });
        }
        ngOnInit() { }
        submit() {
            if (this.form.valid) {
                this.isLoading = true;
                let formData = new FormData();
                formData.append("email", this.form.controls.email.value);
                formData.append("redirect_url", environment.recoveryUrl);
                this.auth.forgotPassword(formData).subscribe((data) => {
                    this.isLoading = false;
                    alert(data.message);
                    this.form.reset();
                    return false;
                }, err => {
                    this.isLoading = false;
                    console.log(err);
                });
            }
        }
    };
    ForgotComponent = __decorate([
        Component({
            selector: 'app-forgot',
            templateUrl: './forgot.component.html',
            styleUrls: ['./forgot.component.css']
        })
    ], ForgotComponent);
    return ForgotComponent;
})();
export { ForgotComponent };
//# sourceMappingURL=forgot.component.js.map