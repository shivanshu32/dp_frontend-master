import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { OrderService } from "src/app/services/order.service";
import { UserService } from "src/app/services/user.service";
import { LoggerService, MessageType } from "src/app/services/logger.service";
import { UtilService } from "src/app/services/util.service";
declare var $: any;

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
})
export class UserlistComponent implements OnInit {
  users = [];
  user: any = {};
  states = [];
  isLoading = false;
  isEditingAccountLoading = false;
  userToEdit = null;

  timeout;
  search = "";
  search_page = "";

  fullData = {
    current_page: 0,
    last_page: 0,
    total: 0
  };

  pagination = {
    current_page:0,
    last_page:0,
    total:0
  }

  formEditAccount = this.fb.group({
    role: ["", Validators.required],
    password: ["", Validators.required],
    first_name: ["", Validators.required],
    last_name: ["", Validators.required],
    company: [""],
    address: ["", Validators.required],
    street_appartment: [""],
    contact_number: ["", Validators.required],
    city: ["", Validators.required],
    state: ["", Validators.required],
    zipcode: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],

    shipping_name: ["", Validators.required],
    shipping_last_name: ["", Validators.required],
    shipping_company: [""],
    shipping_address: ["", Validators.required],
    shipping_street_appartment: [""],
    shipping_phone: ["",Validators.required],
    shipping_city: ["", Validators.required],
    shipping_state: ["", Validators.required],
    shipping_zipcode: ["", Validators.required],
    shipping_email: ["", Validators.email],
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private utilService: UtilService,
    private loggerService: LoggerService,
    private location: Location,
  ) {
    this.user = this.authService.getLocalUser();
    this.states = this.utilService.getStatesList();
  }

  ngOnInit(): void {
    this.getAllUsers();
    $('#editAccountDialog').on('hide.bs.modal', () => {
      this.userToEdit = null;
    });
  }

  handleSearch(_timeout?){
    if (_timeout) {
      let queryString = "";
      if (this.search) {
        queryString += `query=${this.search}&`;
      }
      if (this.search_page) {
        queryString += `page=${this.search_page}&`;
      }
      if (queryString.length > 0) {
        this.getAllUsers(queryString);
        this.location.go(this.router.url.split("?")[0], queryString);
      } else {
        this.location.go(this.router.url.split("?")[0], "");
        this.getAllUsers();
      }
      setTimeout(() => {
        this.search = "";
      }, 500);
    }else{
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let queryString = "";
        if (this.search) {
          queryString += `query=${this.search}&`;
        }
        if (this.search_page) {
          queryString += `page=${this.search_page}&`;
        }
        if (queryString.length > 0) {
          queryString =  queryString;
          this.getAllUsers(queryString);
          this.location.go(this.router.url.split("?")[0], queryString);
        } else {
          this.location.go(this.router.url.split("?")[0], "");
          this.getAllUsers();
        }
        clearTimeout(this.timeout);
      }, 500);
    }
  }

  getAllUsers(queryString?) {
    this.isLoading = true;
    this.userService.getUserList(queryString).subscribe(
      (data: any) => {
        this.isLoading = false;
        this.fullData = data;
        this.users = data.data;
        this.pagination.current_page = data.current_page;
        this.pagination.last_page = data.last_page;
        this.pagination.total = data.total;
        setTimeout(() => {
          $("#myTable").DataTable({
            order: [[5, "desc"]],
            paging:false,
            aoColumnDefs: [
              {
                bSortable: false,
                aTargets: [6],
              },
            ],
          });
        }, 0);
      },
      (error) => {
        this.isLoading = false;
        this.loggerService.write(error, MessageType.Error);
      }
    );
  }

  handleAction(id: any, action: string, index?: number) {
    switch (action) {
      case "edit":
        this.showEditAccountModal(id, index);
        break;
      case "delete":
        confirm("Are you sure?") == true ? this.deleteUser(id) : null;
        break;
      default:
        break;
    }
  }

  deleteUser(id: any) {
    this.userService.deleteSingleUser(id).subscribe(
      (data: any) => {
        if (data.code == 200) {
          this.getAllUsers();
        }
      },
      (error) => {
        this.loggerService.write(error, MessageType.Error);
      }
    );
  }

  handleCheckbox(id: any) {
    this.updateOrderStatus(id);
  }

  showEditAccountModal(id: any, index: number) {
    if (index >= 0) {
      this.userToEdit = this.users[index];
      const formControls = Array.from(Object.keys(this.formEditAccount.controls));
      Object.keys(this.userToEdit).map(key => {
        if(formControls.includes(key)) {
          this.formEditAccount.controls[key].setValue(this.userToEdit[key]);
        }
      });
      $('#editAccountDialog').modal('show');
    }
  }

  submitEditAccount() {
    if (this.formEditAccount.valid && this.userToEdit !== null) {
      this.isEditingAccountLoading = true;
      let formData = new FormData();
      Object.keys(this.formEditAccount.controls).forEach((controlName) => {
        formData.append(controlName, this.formEditAccount.controls[controlName].value);
      });

      this.userService.updateUser(this.userToEdit.id, formData).subscribe(
        (data: any) => {
          this.isEditingAccountLoading = false;
          if (data.code == 200) {
              $("#dialog-content").text(
                "Account updated successfully. Start New Order?"
              );
              this.getAllUsers();
              $('#editAccountDialog').modal('hide');
              $("#dialog-confirm").dialog({
                resizable: false,
                draggable: false,
                height: "auto",
                width: 400,
                modal: true,
                position: { my: "center", at: "center", of: window },
                buttons: {
                  Yes: () => {
                    $(".ui-dialog-content").dialog("close");
                    this.router.navigate(["/add-order"]);
                  },
                  No: () => {
                    $(".ui-dialog-content").dialog("close");
                  },
                },
              });
          } else {
            alert(data.message);
            return false;
          }
        },
        (error) => {
          this.isEditingAccountLoading = false;
          this.loggerService.write(error, MessageType.Error);
        }
      );
    }
  }

  copyDataToShipping(event: any) {
    const { checked } = event.target;

    if (checked) {
      const first_name = this.formEditAccount.controls['first_name'].value;
      const last_name  = this.formEditAccount.controls['last_name'].value;
      const company  = this.formEditAccount.controls['company'].value;
      const address = this.formEditAccount.controls['address'].value;
      const aptSte = this.formEditAccount.controls['street_appartment'].value;
      const contactNumber = this.formEditAccount.controls['contact_number'].value;
      const city = this.formEditAccount.controls['city'].value;
      const state = this.formEditAccount.controls['state'].value;
      const zipCode = this.formEditAccount.controls['zipcode'].value;
      const email = this.formEditAccount.controls['email'].value;

      this.formEditAccount.controls['shipping_name'].setValue(first_name);
      this.formEditAccount.controls['shipping_last_name'].setValue(last_name);
      this.formEditAccount.controls['shipping_company'].setValue(company);
      this.formEditAccount.controls['shipping_address'].setValue(address);
      this.formEditAccount.controls['shipping_street_appartment'].setValue(aptSte);
      this.formEditAccount.controls['shipping_phone'].setValue(contactNumber);
      this.formEditAccount.controls['shipping_city'].setValue(city);
      this.formEditAccount.controls['shipping_state'].setValue(state);
      this.formEditAccount.controls['shipping_zipcode'].setValue(zipCode);
      this.formEditAccount.controls['shipping_email'].setValue(email);
    }else {
      this.formEditAccount.controls['shipping_name'].setValue("");
      this.formEditAccount.controls['shipping_last_name'].setValue("");
      this.formEditAccount.controls['shipping_company'].setValue("");
      this.formEditAccount.controls['shipping_address'].setValue("");
      this.formEditAccount.controls['shipping_street_appartment'].setValue("");
      this.formEditAccount.controls['shipping_phone'].setValue("");
      this.formEditAccount.controls['shipping_city'].setValue("");
      this.formEditAccount.controls['shipping_state'].setValue("");
      this.formEditAccount.controls['shipping_zipcode'].setValue("");
      this.formEditAccount.controls['shipping_email'].setValue("");
    }
  }

  updateOrderStatus(id: any) {
    this.isLoading = true;
    this.userService.updateUserStatus(id).subscribe(
      (data) => {
        this.isLoading = false;
        this.getAllUsers();
      },
      (error) => {
        this.isLoading = false;
        this.loggerService.write(error, MessageType.Error);
      }
    );
  }

  handlePageChangeClick(type){
    if(type=='previous'){
      this.pagination.current_page -= 1;
      this.search_page = this.pagination.current_page + "";
      this.handleSearch();
    }
    if(type == 'next'){
      this.pagination.current_page += 1;
      this.search_page = this.pagination.current_page+"";
      this.handleSearch()
    }
  }
}
