import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { env } from 'process';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment'
declare var $:any;



@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  isLoading = false;
  form = this.fb.group({
    email:['',[Validators.required,Validators.email]]
  })

  constructor(private fb:FormBuilder, private auth:AuthService) { }

  ngOnInit(): void {}

  submit(){
    if(this.form.valid){
      this.isLoading = true;

      let formData = new FormData();
      formData.append("email",this.form.controls.email.value);
      formData.append("redirect_url",environment.recoveryUrl);

      this.auth.forgotPassword(formData).subscribe(
        (data:any)=>{
          this.isLoading = false;
          alert(data.message);
          this.form.reset();
          return false;
        },
        err=>{
          this.isLoading = false;
          console.log(err)
        }
      )

    }
  }

}
