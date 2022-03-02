import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let LoginComponent = /** @class */ (() => {
    let LoginComponent = class LoginComponent {
        constructor(auth, fb, router) {
            this.auth = auth;
            this.fb = fb;
            this.router = router;
            this.isLoading = false;
            this.form = this.fb.group({
                email: ['', [Validators.required, Validators.email]],
                password: ['', Validators.required]
            });
        }
        ngOnInit() {
            if (this.auth.getLocalUser() != null) {
                this.routeToPage(this.auth.getLocalUser().role);
            }
        }
        routeToPage(role) {
            switch (role) {
                case 'Admin':
                    console.log("Admin's role");
                    this.router.navigate(['/administrator']);
                    break;
                case 'Sales':
                    console.log("Sales's role");
                    this.router.navigate(['/sales']);
                    break;
                case 'Production':
                    console.log("Production's role");
                    this.router.navigate(['/production']);
                    break;
                case 'Customer':
                    console.log("Client's role");
                    this.router.navigate(['/client']);
                    break;
                default:
                    console.log("Unidentified role");
                    this.auth.removeLocalUser();
                    break;
            }
        }
        submit() {
            if (this.form.valid) {
                this.isLoading = true;
                let formData = new FormData();
                formData.append("email", this.form.controls.email.value);
                formData.append("password", this.form.controls.password.value);
                this.auth.login(formData).subscribe((data) => {
                    this.isLoading = false;
                    if (data.code === 200) {
                        // console.log(data.data)
                        //store info
                        this.auth.storeLocalUser(data.data);
                        //route based on role
                        this.routeToPage(this.auth.getLocalUser().role);
                    }
                    else {
                        this.auth.removeLocalUser();
                        alert(data.message);
                    }
                }, err => {
                    this.isLoading = false;
                    console.log(err);
                });
            }
        }
        togglePassword() {
            // $(this).toggleClass('active');
            var x = document.getElementById("password");
            if (x.type === "password") {
                x.type = "text";
            }
            else {
                x.type = "password";
            }
        }
    };
    LoginComponent = __decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        })
    ], LoginComponent);
    return LoginComponent;
})();
export { LoginComponent };
//# sourceMappingURL=login.component.js.map