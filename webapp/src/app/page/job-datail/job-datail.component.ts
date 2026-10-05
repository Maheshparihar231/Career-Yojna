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
  jobNotFound: boolean = false;
  jobInactive: boolean = false;

  constructor(private route : ActivatedRoute, private data : DataService, private seo: SeoService){}
  
  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.jobId = param['id'];
      this.getJobData();
    })
  }

  getJobData():void {
    this.data.getJobById(this.jobId).subscribe((job:any)=>{
      if (!job) {
        this.jobNotFound = true;
        this.job = null;
        this.seo.updatePage({
          title: 'Job Not Found',
          description: 'The job position you are looking for does not exist or has been removed.',
          canonicalPath: '/search'
        });
      } else if (job.active === false) {
        this.jobInactive = true;
        this.job = null;
        this.seo.updatePage({
          title: 'Position Filled',
          description: 'The job position you are looking for has been filled or is no longer available.',
          canonicalPath: '/search'
        });
      } else {
        this.job = job;
        if (this.job) {
          this.seo.updateJobPage(
            this.job.title,
            this.job.company_name,
            this.job.location,
            this.job.salary
          );
          this.seo.setJobPostingSchema(this.job);
        }
      }
    })
  }

}
