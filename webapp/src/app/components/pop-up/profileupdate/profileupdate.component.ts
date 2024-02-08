import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../core/snackbar.service';

@Component({
  selector: 'app-profileupdate',
  templateUrl: './profileupdate.component.html',
  styleUrls: ['./profileupdate.component.css']
})
export class ProfileupdateComponent {
  previewImageUrl: string | ArrayBuffer | null = "https://lh3.googleusercontent.com/a-/AFdZucpC_6WFBIfaAbPHBwGM9z8SxyM1oV4wB4Ngwp_UyQ=s96-c";
  profileForm : FormGroup
  constructor(
    private dialog : MatDialog,
    private formBuilder : FormBuilder,
    private snackBar : SnackbarService,
  ){
    this.profileForm = this.formBuilder.group({
      previewImageUrl : [''],
      resumeUrl : [''],
      name : [''],
      role : [''],
      currentCompany : ['']
    })
  }
  loadFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  loadResume(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      //this.previewImageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  submit(){
    this.snackBar.openSnackBar("updated","ok");
    this.dialog.closeAll()
  }
}
