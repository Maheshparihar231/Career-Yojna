import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UploadBannerComponent } from 'src/app/components/pop-up/upload-banner/upload-banner.component';
import { Job } from 'src/app/data/jobs';
import { DataService } from 'src/app/service/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize, map, startWith, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent{

}
