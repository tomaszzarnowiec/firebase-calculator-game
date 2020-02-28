import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  loginForm: FormGroup;

  toastLoginError: ToastOptions = {
    title: 'Coś poszło nie tak',
    msg: 'Sprawdź swoje detale logowania.'
  }

  constructor(private authService: AuthService, private formBuilder: FormBuilder, public toastyService: ToastyService, public toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'default';
    this.toastyConfig.timeout = 5000;
    this.toastyConfig.position = "top-right";
  }

  ngOnInit() {
    
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    
  }

  loginViaEmail() {
    this.email = this.loginForm.value.email;
    this.password = this.loginForm.value.password;

    if(!this.loginForm.valid){
      this.toastyService.error(this.toastLoginError)
      return;
    }

    this.authService.SignIn(this.email, this.password);
  }

  loginViaGoogle() {
    this.authService.GoogleAuth();
  }

}
