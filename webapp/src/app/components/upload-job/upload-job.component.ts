import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Job } from 'src/app/data/jobs';
import { DataService } from 'src/app/service/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialog } from '@angular/material/dialog';
import { Observable, finalize, map, startWith, tap } from 'rxjs';
import { UploadBannerComponent } from '../pop-up/upload-banner/upload-banner.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SnackbarService } from '../core/snackbar.service';

@Component({
  selector: 'app-upload-job',
  templateUrl: './upload-job.component.html',
  styleUrls: ['./upload-job.component.css']
})
export class UploadJobComponent implements OnInit {

  jobForm: FormGroup;
  downloadLink: string = '';
  jobs: Job[] = [];
  isEditing = false;
  currentJobId: string | null = null;

  async ngOnInit(): Promise<void> {
    this.loadJobs();
    await this.getAllBanners();
  }

  constructor(private data: DataService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
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

  // Method to check if user is authenticated
  async isUserAuthenticated(): Promise<boolean> {
    try {
      const auth = this.afStorage.storage.app.auth().currentUser;
      return !!auth;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Method to refresh banners list
  async refreshBanners() {
    await this.getAllBanners();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  uploadBanner() {
    const dialogRef = this._dialogRef.open(UploadBannerComponent, {
      width: '500px',
      disableClose: true
    });
    
    dialogRef.componentInstance.uploadComplete.subscribe(async () => {
      dialogRef.close();
      await this.getAllBanners();
      this.snackbar.openSnackBar('Banner uploaded successfully!');
    });
    
    // Handle dialog close without upload
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log('Banner upload dialog closed without completion');
      }
    });
  }

  async getAllBanners() {
    try {
      // Check if user is authenticated
      const auth = this.afStorage.storage.app.auth().currentUser;
      if (!auth) {
        console.log('User not authenticated, cannot load banners');
        this.snackbar.openSnackBar('Please sign in to manage banners');
        this.options = [];
        return;
      }

      const rootRef = this.afStorage.ref('Banners');
      const list$ = rootRef.listAll();

      list$.subscribe(
        (result) => {
          const fileNames = new Set<string>();
          result.items.forEach(item => {
            fileNames.add(item.name);
          });
          
          // Clear existing options and add new ones
          this.options = Array.from(fileNames);
          console.log('Loaded banners:', this.options.length);
          
          if (this.options.length === 0) {
            this.snackbar.openSnackBar('No banners found. Upload a banner first.');
          } else {
            console.log('Successfully loaded banners:', this.options);
          }
        },
        (error) => {
          console.error('Error retrieving uploaded files:', error);
          
          // Provide specific error messages based on error type
          if (error.code === 'storage/unauthorized') {
            this.snackbar.openSnackBar('Please sign in to access banners');
          } else if (error.code === 'storage/object-not-found') {
            this.snackbar.openSnackBar('No banners folder found. Upload a banner first.');
          } else {
            this.snackbar.openSnackBar('Error loading banners: ' + error.message);
          }
          
          this.options = []; // Clear options on error
        }
      );
    } catch (error) {
      console.error('Error in getAllBanners:', error);
      this.snackbar.openSnackBar('Error accessing banner storage');
      this.options = [];
    }
  }

  updateDownloadLink(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value;
    if (selectedOption && this.options.includes(selectedOption)) {
      const path = 'Banners/' + selectedOption;
      const rootRef = this.afStorage.ref(path);
      
      rootRef.getDownloadURL().subscribe(
        (url) => {
          this.downloadLink = url;
          this.jobForm.patchValue({ img_url: url });
          console.log('Banner URL updated:', url);
          this.snackbar.openSnackBar('Banner selected successfully');
        },
        (error) => {
          console.error('Error getting download URL:', error);
          this.snackbar.openSnackBar('Error loading banner: ' + error.message);
          this.downloadLink = '';
          this.jobForm.patchValue({ img_url: '' });
        }
      );
    } else {
      this.downloadLink = '';
      this.jobForm.patchValue({ img_url: '' });
      console.log('Banner selection cleared');
    }
  }

  loadJobs() {
    this.data.getAllJobs().subscribe(
      (jobs) => {
        this.jobs = jobs;
      },
      (error) => {
        this.snackbar.openSnackBar('Error loading jobs: ' + error);
      }
    );
  }

  editJob(job: Job) {
    this.isEditing = true;
    this.currentJobId = job.id;
    this.jobForm.patchValue({
      ...job,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
    });
    
    if (job.img_url) {
      this.downloadLink = job.img_url;
    }
  }

  deleteJob(job: Job) {
    if (confirm('Are you sure you want to delete this job posting?')) {
      this.data.deleteJob(job).subscribe(
        () => {
          this.snackbar.openSnackBar('Job deleted successfully');
          this.loadJobs();
        },
        error => {
          this.snackbar.openSnackBar('Error deleting job: ' + error);
        }
      );
    }
  }

  resetForm() {
    this.jobForm.reset();
    this.isEditing = false;
    this.currentJobId = null;
    this.downloadLink = '';
    this.jobForm.patchValue({
      post_date: new Date().toISOString()
    });
  }

  addJob() {
    if (this.jobForm.valid) {
      const jobData = {
        ...this.jobForm.value,
        skills_required: this.jobForm.value.skills_required.split(',').map((skill: string) => skill.trim()),
        benefits: this.jobForm.value.benefits.split(',').map((benefit: string) => benefit.trim()),
        responsibilities: this.jobForm.value.responsibilities.split(',').map((resp: string) => resp.trim()),
        requirements: this.jobForm.value.requirements.split(',').map((req: string) => req.trim())
      };

      if (this.isEditing && this.currentJobId) {
        jobData.id = this.currentJobId;
        this.data.updateJob(jobData).subscribe(
          () => {
            this.snackbar.openSnackBar("Job updated successfully");
            this.resetForm();
            this.loadJobs();
          },
          error => {
            this.snackbar.openSnackBar("Error updating job: " + error);
          }
        );
      } else {
        this.data.addJob(jobData).subscribe(
          () => {
            this.snackbar.openSnackBar("Job created successfully");
            this.resetForm();
            this.loadJobs();
          },
          error => {
            this.snackbar.openSnackBar("Error creating job: " + error);
          }
        );
      }
    } else {
      this.snackbar.openSnackBar("Please fill in all required fields");
    }
  }
}
