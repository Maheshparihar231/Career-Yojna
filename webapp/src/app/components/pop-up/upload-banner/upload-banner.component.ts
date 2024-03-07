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
  @Output() uploadComplete = new EventEmitter<void>();
  constructor(private asf: AngularFireStorage,private snackBar : SnackbarService,) { }

  async upload(event: Event) {
    event.preventDefault(); // Prevent form submission
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const path = `Banners/${file.name}`;
      this.showProgressBar = true;
      const uploadTask = this.asf.upload(path, file);
      uploadTask.percentageChanges().subscribe((percentage) => {
        this.uploadProgress = percentage ?? 0;

      });
      try {
        await uploadTask;
        this.showProgressBar = false;
        this.uploadProgress = 0;
        const url = (await uploadTask).ref.getDownloadURL();
        console.log(url);
        this.snackBar.openSnackBar(`${file.name} uploaded successfully`)
        this.uploadComplete.emit();
        // You can handle the URL here, such as saving it to a database
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  loadFile(event: any) {
    const file = event.target.files?.[0];
    const reader = new FileReader();
    if (file) {
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
