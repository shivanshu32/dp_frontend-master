import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {
  token:string = "";
  isLoading = false;

  form = this.fb.group({
    password:['',[Validators.required, Validators.minLength(8)]],
    password_confirmation:['',[Validators.required]]
  })

  constructor(private route:ActivatedRoute, private fb:FormBuilder, private auth:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params:any)=>{
      this.token = params.token;
    })
  }

  submit(){

    if(this.form.controls.password.value !== this.form.controls.password_confirmation.value){
      this.form.controls.password_confirmation.setErrors({'required':true})
      return false;
    }

    if(this.form.valid && this.token){
      this.isLoading = true;

      let formData = new FormData();
      formData.append("token",this.token);
      formData.append("password",this.form.controls.password.value);
      formData.append("password_confirmation",this.form.controls.password_confirmation.value);

      this.auth.recoverPassword(formData).subscribe(
        (data:any)=>{
          this.isLoading = false;

          if(data.code === 200){
            alert(data.message);
            this.router.navigate(['/login']);
            return false;
          }else{
            alert(data.message);
            return false;
          }
        },
        err => {
          this.isLoading = false;
          console.log(err)
        }
      )
    }
  }

}
