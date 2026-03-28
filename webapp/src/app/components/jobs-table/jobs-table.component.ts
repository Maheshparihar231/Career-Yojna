import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Job } from 'src/app/data/jobs';
import { DataService } from 'src/app/service/data.service';


@Component({
  selector: 'app-jobs-table',
  templateUrl: './jobs-table.component.html',
  styleUrls: ['./jobs-table.component.css']
})
export class JobsTableComponent implements OnInit, AfterViewInit {
  @Input() showEditDelete: boolean = false;
  @Output() editRequest = new EventEmitter<Job>();
  @Output() deleteRequest = new EventEmitter<Job>();

  displayedColumns: string[] = ['company_name', 'apply_link', 'post_date', 'role'];
  dataSource: MatTableDataSource<Job>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  jobList: Job[] = [];

  constructor(
    private dataService: DataService,
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource<Job>([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    if (this.showEditDelete) {
      this.displayedColumns = [...this.displayedColumns, 'edit', 'delete'];
    } else {
      this.displayedColumns = [...this.displayedColumns, 'delete'];
    }
    this.refreshJobs();    
  }

  refreshJobs() {
    this.dataService.getAllJobs().subscribe({
      next: (jobs) => {
        this.dataSource.data = jobs;
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
      }
    });
  }

  private jobMatchesFilter(job: Job, filter: string): boolean {
    const searchStr = filter.toLowerCase();
    return (
      job.company_name?.toLowerCase().includes(searchStr) ||
      job.role?.toLowerCase().includes(searchStr) ||
      job.location?.toLowerCase().includes(searchStr) ||
      job.job_type?.toLowerCase().includes(searchStr) ||
      job.mini_description?.toLowerCase().includes(searchStr)
    );
  }

  onEdit(job: Job) {
    this.editRequest.emit(job);
  }

  deleteJob(job: Job) {
    const confirmMessage = `Are you sure you want to delete the job: ${job.title || ''} at ${job.company_name || ''}?`;
    
    if (window.confirm(confirmMessage)) {
      if (this.showEditDelete) {
        this.deleteRequest.emit(job);
      } else {
        this.dataService.deleteJob(job).subscribe({
          next: () => {
            this.refreshJobs();
          },
          error: (error) => {
            console.error('Error deleting job:', error);
          }
        });
      }
    }
  }

}
