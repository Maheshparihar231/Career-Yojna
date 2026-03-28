import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/service/data.service';
import { Observable } from 'rxjs';
import { BlogsTableComponent } from '../../components/blogs-table/blogs-table.component';
import { JobsTableComponent } from '../../components/jobs-table/jobs-table.component';

type ContentType = 'jobs' | 'blogs' | null;

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {
  selectedContentType: ContentType = null;
  
  @ViewChild(BlogsTableComponent) blogsTable!: BlogsTableComponent;
  @ViewChild(JobsTableComponent) jobsTable!: JobsTableComponent;

  constructor(private dataService: DataService) {}

  onContentTypeChange(): void {
    // You can add any additional logic here when content type changes
    console.log('Content type changed to:', this.selectedContentType);
  }

  // Method to refresh tables when content is updated
  refreshTables() {
    if (this.selectedContentType === 'blogs' && this.blogsTable) {
      this.blogsTable.refreshData();
    }
    if (this.selectedContentType === 'jobs' && this.jobsTable) {
      // Add refresh method to jobs table if needed
      // this.jobsTable.refreshData();
    }
  }
}
