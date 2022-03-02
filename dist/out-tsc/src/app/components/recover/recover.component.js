import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let RecoverComponent = /** @class */ (() => {
    let RecoverComponent = class RecoverComponent {
        constructor(route, fb, auth, router) {
            this.route = route;
            this.fb = fb;
            this.auth = auth;
            this.router = router;
            this.token = "";
            this.isLoading = false;
            this.form = this.fb.group({
                password: ['', [Validators.required, Validators.minLength(8)]],
                password_confirmation: ['', [Validators.required]]
            });
        }
        ngOnInit() {
            this.route.params.subscribe((params) => {
                this.token = params.token;
            });
        }
        submit() {
            if (this.form.controls.password.value !== this.form.controls.password_confirmation.value) {
                this.form.controls.password_confirmation.setErrors({ 'required': true });
                return false;
            }
            if (this.form.valid && this.token) {
                this.isLoading = true;
                let formData = new FormData();
                formData.append("token", this.token);
                formData.append("password", this.form.controls.password.value);
                formData.append("password_confirmation", this.form.controls.password_confirmation.value);
                this.auth.recoverPassword(formData).subscribe((data) => {
                    this.isLoading = false;
                    if (data.code === 200) {
                        alert(data.message);
                        this.router.navigate(['/login']);
                        return false;
                    }
                    else {
                        alert(data.message);
                        return false;
                    }
                }, err => {
                    this.isLoading = false;
                    console.log(err);
                });
            }
        }
    };
    RecoverComponent = __decorate([
        Component({
            selector: 'app-recover',
            templateUrl: './recover.component.html',
            styleUrls: ['./recover.component.css']
        })
    ], RecoverComponent);
    return RecoverComponent;
})();
export { RecoverComponent };
//# sourceMappingURL=recover.component.js.map