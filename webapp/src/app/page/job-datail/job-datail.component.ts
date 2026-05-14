import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Job } from 'src/app/data/jobs';
import { DataService } from 'src/app/service/data.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-job-datail',
  templateUrl: './job-datail.component.html',
  styleUrls: ['./job-datail.component.css']
})
export class JobDatailComponent implements OnInit{
  jobId: string = '';
  job : Job | null = null;
  defaultImageUrl: string = 'assets/images/default-company.png';

  constructor(private route : ActivatedRoute, private data : DataService, private seo: SeoService){}
  
  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.jobId = param['id'];
      this.getJobData();
    })
  }

  getJobData():void {
    this.data.getJobById(this.jobId).subscribe((job:any)=>{
      this.job = job;
      if (this.job) {
        this.seo.updateJobPage(
          this.job.title,
          this.job.company_name,
          this.job.location,
          this.job.salary
        );
      }
    })
  }

}
