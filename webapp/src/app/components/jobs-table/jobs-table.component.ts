import { getLocaleFirstDayOfWeek } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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

  displayedColumns: string[] = ['company_name', 'apply_link', 'post_date', 'role','delete'];
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
    console.log("works");
    this.getAllJobs();    
  }

  getAllJobs() {
    this.dataService.getAllJobs().subscribe(
      (res : any[]) => {
        if(res && res.length>0){
          this.jobList = res.map((e:any)=>{
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            this.jobList.push(data);
            return data;
          });
        }else{
          console.log("No Data received");
        }
      }, (err) => {
        console.error(err);
      }
    )
    this.setData(this.jobList);
  }

  setData(jobList: Job[]) {
    this.dataSource.data = jobList;
    console.log(this.dataSource.data);
  }

  updateJob() {

  }

  deleteJob(job: Job) {
    if (window.confirm('Are you sure? ' + job.company_name)) {
      this.dataService.deleteJob(job);
      this.getAllJobs();
    }
  }

}
