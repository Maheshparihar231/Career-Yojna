import { Component } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm : FormGroup

  constructor(
    private formBuilder : FormBuilder
  ){
    this.loginForm=this.formBuilder.group({
      email : ['',[Validators.required,Validators.email]],
      password : ['',[Validators.required,Validators.minLength(6)]]
    })
  }

  submit(){
    console.log(this.loginForm.value);
    
  }

}
