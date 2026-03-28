import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { SnackbarService } from '../../core/snackbar.service';

@Component({
  selector: 'app-upload-banner',
  templateUrl: './upload-banner.component.html',
  styleUrls: ['./upload-banner.component.css']
})
export class UploadBannerComponent {
  previewImageUrl: string | ArrayBuffer | null = "https://placehold.co/200";
  showProgressBar: boolean = false;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  uploadError: string | null = null;
  @Output() uploadComplete = new EventEmitter<void>();
  
  constructor(
    private asf: AngularFireStorage,
    private snackBar: SnackbarService
  ) { }

  async upload(event: Event) {
    try {
      event.preventDefault(); // Prevent form submission
      
      // Check authentication
      const auth = this.asf.storage.app.auth().currentUser;
      if (!auth) {
        this.snackBar.openSnackBar('Please sign in to upload images');
        this.uploadError = 'Authentication required';
        return;
      }

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput.files?.[0];
      
      if (!file) {
        this.snackBar.openSnackBar('Please select a file to upload');
        this.uploadError = 'No file selected';
        return;
      }

      console.log('Selected file:', file.name, 'Type:', file.type, 'Size:', file.size);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.snackBar.openSnackBar('Please select an image file');
        this.uploadError = 'Invalid file type. Only images are allowed.';
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.snackBar.openSnackBar('File size too large. Maximum size is 5MB.');
        this.uploadError = 'File size exceeds 5MB limit';
        return;
      }

      // Clear any previous errors
      this.uploadError = null;
      this.isUploading = true;
      this.showProgressBar = true;

      // Show loading message
      this.snackBar.openSnackBar('Starting image upload...');

      // Create a unique file path with sanitized filename
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const path = `Banners/${new Date().getTime()}_${sanitizedFileName}`;
      console.log('Upload path:', path);

      try {
        // Get storage reference
        const fileRef = this.asf.ref(path);
        console.log('Storage reference created');

        // Start upload
        const uploadTask = this.asf.upload(path, file);
        console.log('Upload task created');

        // Monitor upload progress
        uploadTask.percentageChanges().subscribe({
          next: (percentage) => {
            if (percentage !== undefined) {
              this.uploadProgress = percentage;
              console.log('Upload progress:', percentage);
              this.snackBar.openSnackBar(`Uploading: ${Math.round(percentage)}%`);
            }
          },
          error: (error) => {
            console.error('Error monitoring upload progress:', error);
            this.snackBar.openSnackBar('Error monitoring upload progress');
          }
        });

        // Wait for upload to complete
        console.log('Waiting for upload to complete...');
        await uploadTask.snapshotChanges().toPromise();
        console.log('Upload completed');

        // Get download URL
        console.log('Getting download URL...');
        const url = await fileRef.getDownloadURL().toPromise();
        console.log('Download URL received:', url);

        // Success handling
        this.showProgressBar = false;
        this.uploadProgress = 0;
        this.isUploading = false;
        this.snackBar.openSnackBar(`${file.name} uploaded successfully!`);
        this.uploadComplete.emit();

      } catch (error: any) {
        console.error('Error during upload process:', error);
        const errorMessage = error.message || 'Unknown error occurred during upload';
        this.snackBar.openSnackBar('Error uploading image: ' + errorMessage);
        this.uploadError = errorMessage;
        this.showProgressBar = false;
        this.uploadProgress = 0;
        this.isUploading = false;
        throw error;
      }

    } catch (error) {
      console.error('Top level error in upload:', error);
      this.snackBar.openSnackBar('Error uploading image. Please try again.');
      this.uploadError = 'Upload failed. Please try again.';
      this.showProgressBar = false;
      this.uploadProgress = 0;
      this.isUploading = false;
      
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  loadFile(event: any) {
    const file = event.target.files?.[0];
    
    if (!file) {
      this.previewImageUrl = "https://placehold.co/200";
      this.uploadError = null;
      return;
    }

    // Validate file type before preview
    if (!file.type.startsWith('image/')) {
      this.snackBar.openSnackBar('Please select an image file');
      this.uploadError = 'Invalid file type. Only images are allowed.';
      this.previewImageUrl = "https://placehold.co/200";
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.snackBar.openSnackBar('File size too large. Maximum size is 5MB.');
      this.uploadError = 'File size exceeds 5MB limit';
      this.previewImageUrl = "https://placehold.co/200";
      return;
    }

    // Clear any previous errors
    this.uploadError = null;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImageUrl = e.target.result;
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      this.snackBar.openSnackBar('Error reading file. Please try again.');
      this.uploadError = 'Error reading file';
      this.previewImageUrl = "https://placehold.co/200";
    };
    reader.readAsDataURL(file);
  }

  // Method to clear file selection
  clearFile() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.previewImageUrl = "https://placehold.co/200";
    this.uploadError = null;
    this.showProgressBar = false;
    this.uploadProgress = 0;
    this.isUploading = false;
  }
}
