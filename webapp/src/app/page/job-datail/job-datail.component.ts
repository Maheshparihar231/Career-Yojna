import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Job } from 'src/app/data/jobs';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-job-datail',
  templateUrl: './job-datail.component.html',
  styleUrls: ['./job-datail.component.css']
})
export class JobDatailComponent implements OnInit{
  jobId: string = '';
  job : Job | null = null;

  constructor(private route : ActivatedRoute,private data : DataService){}
  
  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.jobId = param['id'];
      this.getJobData();
    })
  }

  getJobData():void {
    this.data.getJobById(this.jobId).subscribe((job:any)=>{
      this.job = job;
      //console.log(job);
    })
  }

}
