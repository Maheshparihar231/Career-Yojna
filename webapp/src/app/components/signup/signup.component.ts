import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signUpForm : FormGroup

  constructor(
    private formBuilder : FormBuilder
  ){
    this.signUpForm=this.formBuilder.group({
      fullName : ['',[Validators.required]],
      email : ['',[Validators.required,Validators.email]],
      password : ['',[Validators.required,Validators.minLength(6)]]
    })
  }

  submit(){
    console.log(this.signUpForm.value);
    
    
  }
}
