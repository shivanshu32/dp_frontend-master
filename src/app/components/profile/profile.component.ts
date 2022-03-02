import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:any={};
  isLoading = false;
  form = this.fb.group({
    first_name:['',Validators.required],
    last_name:['',Validators.required],
    contact_number:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    address:['',Validators.required],
    city:['',Validators.required],
    state:['',Validators.required],
    zipcode:['',Validators.required]
  });
  formShipping = this.fb.group({
    shipping_email:['',[Validators.required,Validators.email]],
    shipping_name:['',Validators.required],
    shipping_street_appartment:['',Validators.required],
    shipping_city:['',[Validators.required]],
    shipping_state:['',Validators.required],
    shipping_zipcode:['',Validators.required],
    shipping_address:['',Validators.required]
  });
  formPassword = this.fb.group({
    current_password:['',[Validators.required]],
    password:['',Validators.required],
    password_confirmation:['',Validators.required]
  })

  constructor(private auth:AuthService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.user = this.auth.getLocalUser();
    this.getProfileData();
  }

  submit(){
    if(this.form.valid){
      this.isLoading=true;
      let formData = new FormData();
      Object.keys(this.form.controls).forEach(controlName=>{
        formData.append(controlName,this.form.controls[controlName].value)
      })
      this.auth.updateProfileData(formData).subscribe(
        (data:any)=>{
          this.isLoading = false;
          this.getProfileData();
        },
        err=>{
          this.isLoading = false;
          console.log(err);
        }
      )
    }
  }

  submitShipping(){
    if(this.formShipping.valid){
      this.isLoading=true;
      let formData = new FormData();
      Object.keys(this.formShipping.controls).forEach(controlName=>{
        formData.append(controlName,this.formShipping.controls[controlName].value)
      })
      this.auth.updateProfileShippingData(formData).subscribe(
        (data:any)=>{
          this.isLoading = false;
          this.getProfileData();
        },
        err=>{
          this.isLoading = false;
          console.log(err);
        }
      )
    }
  }

  submitPassword(){
    if(this.formPassword.controls.password.value !== this.formPassword.controls.password_confirmation.value){
      this.formPassword.controls.password_confirmation.setErrors({required:false});
      return false;
    }

    if(this.formPassword.valid){
      this.isLoading=true;
      let formData = new FormData();
      Object.keys(this.formPassword.controls).forEach(controlName=>{
        formData.append(controlName,this.formPassword.controls[controlName].value)
      })
      this.auth.updatePassword(formData).subscribe(
        (data:any)=>{
          this.isLoading = false;
          if(data.code === 200){
            alert(data.message);
            alert("Please log back in with the new password");
            this.auth.removeLocalUser();
          }else{
            alert(data.message);
          }
          console.log(data);
        },
        err=>{
          this.isLoading = false;
          console.log(err);
        }
      )
    }
  }

  prefillValues(user){
    Object.keys(this.form.controls).forEach(controlName=>{
      this.form.controls[controlName].setValue(user[controlName]);
      this.form.controls[controlName].markAsTouched();
    })
    Object.keys(this.formShipping.controls).forEach(controlName=>{
      this.formShipping.controls[controlName].setValue(user[controlName]);
      this.formShipping.controls[controlName].markAsTouched();
    })
  }

  getProfileData(){
    this.isLoading = true;
    this.auth.getProfileData().subscribe(
      (data:any)=>{
        this.isLoading = false;
        if(data.code === 200){
          this.prefillValues(data.data);
        }else{
          alert(data.message);
          return false;
        }
        console.log(data);
      },
      err=>{
        this.isLoading = false;
        console.log(err)
      }
    )
  }

}
