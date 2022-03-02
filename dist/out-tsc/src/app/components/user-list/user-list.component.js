import { __decorate } from "tslib";
import { Component } from "@angular/core";
let UserlistComponent = /** @class */ (() => {
    let UserlistComponent = class UserlistComponent {
        constructor(userService, router, authService) {
            this.userService = userService;
            this.router = router;
            this.authService = authService;
            this.users = [];
            this.user = {};
            this.isLoading = false;
            this.user = this.authService.getLocalUser();
        }
        getAllUsers() {
            this.isLoading = true;
            this.userService.getUserList().subscribe((data) => {
                this.isLoading = false;
                console.log(data);
                this.users = data.data;
                setTimeout(() => {
                    $("#myTable").DataTable({
                        order: [[5, "desc"]],
                        aoColumnDefs: [
                            {
                                bSortable: false,
                                aTargets: [6],
                            },
                        ],
                    });
                }, 0);
            }, (err) => {
                this.isLoading = false;
                console.log(err);
            });
        }
        handleAction(id, action) {
            switch (action) {
                case "edit":
                    this.router.navigate(["/create-user"], { queryParams: { id: id } });
                    break;
                case "delete":
                    confirm("Are you sure?") == true ? this.deleteUser(id) : null;
                    break;
                default:
                    break;
            }
        }
        deleteUser(id) {
            this.userService.deleteSingleUser(id).subscribe((data) => {
                if (data.code == 200) {
                    console.log(data);
                    this.getAllUsers();
                }
            }, (err) => {
                console.log(err);
            });
        }
        ngOnInit() {
            this.getAllUsers();
        }
        handleCheckbox(id) {
            // console.log(e.target.checked);
            // $("#" + `${field}_${id}`).val(e.target.checked);
            this.updateOrderStatus(id);
        }
        updateOrderStatus(id) {
            this.isLoading = true;
            this.userService.updateUserStatus(id).subscribe((data) => {
                this.isLoading = false;
                console.log(data);
                this.getAllUsers();
            }, (err) => {
                this.isLoading = false;
                console.log(err);
            });
        }
    };
    UserlistComponent = __decorate([
        Component({
            selector: "app-user-list",
            templateUrl: "./user-list.component.html",
            styleUrls: ["./user-list.component.css"],
        })
    ], UserlistComponent);
    return UserlistComponent;
})();
export { UserlistComponent };
//# sourceMappingURL=user-list.component.js.map