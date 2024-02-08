import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileupdateComponent } from '../pop-up/profileupdate/profileupdate.component';
import { SnackbarService } from '../core/snackbar.service';
import { WorkupdateComponent } from '../pop-up/workupdate/workupdate.component';

@Component({
  selector: 'app-profiledata',
  templateUrl: './profiledata.component.html',
  styleUrls: ['./profiledata.component.css']
})
export class ProfiledataComponent {
  profileData: any
  resumeUrl = null
  // "https://lh3.googleusercontent.com/a-/AFdZucpC_6WFBIfaAbPHBwGM9z8SxyM1oV4wB4Ngwp_UyQ=s96-c";

  constructor(
    private _dialogRef: MatDialog,
    private _snack: SnackbarService
  ) { }

  updateProfile() {
    this._dialogRef.open(ProfileupdateComponent)
  }

  openResume() {
    if (this.resumeUrl) {
      window.open(this.resumeUrl, '_blank');
    }
    else {
      this._snack.openSnackBar("Resume Not Uploaded");
    }
  }
  updateWork(){
    this._dialogRef.open(WorkupdateComponent)
  }

  addWork(){
    this._dialogRef.open(WorkupdateComponent)
  }

}
