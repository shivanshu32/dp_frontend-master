import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.css"],
})
export class CreateuserComponent implements OnInit {
  user: any = {};
  isEdit = false;
  remoteUserID = "";
  isLoading = false;
  form = this.fb.group({
    first_name: ["", Validators.required],
    last_name: ["", Validators.required],
    contact_number: ["", Validators.required],
    role: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: [""],
    address: ["", Validators.required],
    city: ["", Validators.required],
    state: ["", Validators.required],
    zipcode: ["", Validators.required],
    shipping_email: ["", Validators.email],
    shipping_name: [""],
    shipping_phone: ["",Validators.required],
    shipping_street_appartment: [""],
    shipping_city: [""],
    shipping_state: [""],
    shipping_zipcode: [""],
    shipping_address: [""],
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getLocalUser();
    this.route.queryParams.subscribe((param) => {
      if (param.id) {
        this.remoteUserID = param.id;
        this.isEdit = true;
        this.getProfileData(this.remoteUserID);
      }
    });
    // this.getProfileData();
  }

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      let formData = new FormData();
      Object.keys(this.form.controls).forEach((controlName) => {
        formData.append(controlName, this.form.controls[controlName].value);
      });

      if (this.isEdit) {
        this.userService.updateUser(this.remoteUserID, formData).subscribe(
          (data: any) => {
            this.isLoading = false;
            console.log(data);
            if (data.code == 200) {
              this.router.navigate(["/user-list"]);
            }else{
              alert(data.message);
              return false;
            }
            // this.getProfileData();
          },
          (err) => {
            this.isLoading = false;
            console.log(err);
          }
        );
      } else {
        this.userService.createUser(formData).subscribe(
          (data: any) => {
            this.isLoading = false;
            console.log(data);
            if (data.code == 200) {
              this.router.navigate(["/user-list"]);
            } else {
              alert(data.message);
              return false;
            }

            // this.getProfileData();
          },
          (err) => {
            this.isLoading = false;
            console.log(err);
          }
        );
      }
    }
  }

  prefillValues(user) {
    Object.keys(this.form.controls).forEach((controlName) => {
      this.form.controls[controlName].setValue(
        user[controlName] === "null" ? "" : user[controlName]
      );
      this.form.controls[controlName].markAsTouched();
    });
  }

  getProfileData(id) {
    this.isLoading = true;
    this.userService.getUserDetails(id).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data.code === 200) {
          console.log(data);
          this.prefillValues(data.data);
        } else {
          alert(data.message);
          this.router.navigate(["/"]);
          return false;
        }
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }
}
