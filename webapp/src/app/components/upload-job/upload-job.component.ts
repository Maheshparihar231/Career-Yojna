import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Job } from 'src/app/data/jobs';
import { DataService } from 'src/app/service/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialog } from '@angular/material/dialog';
import { Observable, finalize, map, startWith, tap } from 'rxjs';
import { UploadBannerComponent } from '../pop-up/upload-banner/upload-banner.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-upload-job',
  templateUrl: './upload-job.component.html',
  styleUrls: ['./upload-job.component.css']
})
export class UploadJobComponent implements OnInit{
  
  jobForm: FormGroup
  downloadLink: any;

  ngOnInit(): void {
    //this.getAllJobs();
    this.getAllBanners();
    console.log(this.options);
  }

  constructor(private data: DataService,
    private fb: FormBuilder,

    private afStorage: AngularFireStorage,
    private _dialogRef: MatDialog) {

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      mini_description: ['', [Validators.required]],
      post_date: [new Date().toISOString()],
      img_url: ['',],
      apply_link: ['',],
      role: ['',],
      department: ['',],
      remote: ['',],
      company_name: ['',],
      location: ['',],
      job_type: ['',],
      salary: ['',],
      experience: ['',],
      qualification: ['',],
      skills_required: [''],
      benefits: ['',],
      responsibilities: ['',],
      requirements: ['',],
      deadline: ['']
    })
  }

  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  uploadBanner() {
    const dialogRef = this._dialogRef.open(UploadBannerComponent);
    dialogRef.componentInstance.uploadComplete.subscribe(() => {
      dialogRef.close();

      this.getAllBanners();
    })
  }

  getAllBanners() {
    const rootRef = this.afStorage.ref('Banners');
    const list$ = rootRef.listAll();

    list$.subscribe(
      (result) => {
        const fileNames = new Set<string>();
        result.items.forEach(item => {
          fileNames.add(item.name);
        });
        this.options.push(...Array.from(fileNames));
      },
      (error) => {
        console.error('Error retrieving uploaded files:', error);
      }
    );
  }

  updateDownloadLink(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value;
    if (selectedOption && this.options.includes(selectedOption)) {
      const path = 'Banners/' + selectedOption;
      const rootRef = this.afStorage.ref(path);
      rootRef.getDownloadURL().subscribe(
        (url) => {
          this.downloadLink = url;
          this.jobForm.patchValue({ img_url: url }); // Set the img_url value in the job form
        },
        (error) => {
          console.error('Error getting download URL:', error);
        }
      );
    } else {
      this.downloadLink = '';
      this.jobForm.patchValue({ img_url: '' }); // Clear the img_url value in the job form
    }
  }



  addJob() {
    if (this.jobForm.valid) {
      console.log(this.jobForm.value);
      console.log('sent');
      this.data.addData(this.jobForm.value);
    }
    else {
      alert('enter data')
    }
  }

}
