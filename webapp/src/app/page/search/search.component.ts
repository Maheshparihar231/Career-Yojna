import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from 'src/app/data/jobs';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  type : any
  jobList: Job[] = [];
  top5Jobs: Job[] = [];

  constructor(private route: ActivatedRoute,private router: Router,private dataService : DataService) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras.state) {
      const data = currentNavigation.extras.state;
      console.log(this.type = data['data'].key1); // Access the data passed during navigation
    }
  }
  ngOnInit(): void {
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
          console.log(this.jobList);
          this.getTopJobs();
        }else{
          console.log("No Data received");
        }
      }, (err) => {
        console.error(err);
      }
    )
    
  }

  getTopJobs() {
    // Sort the jobList array by posting date in descending order
    const sortedJobs = this.jobList.sort((a, b) => {
      return new Date(b.post_date).getTime() - new Date(a.post_date).getTime();
    });
  
    // Select the top 5 jobs
    this.top5Jobs = sortedJobs.slice(0, 5);
  
    console.log(this.top5Jobs);
  }

  navigateToJob(jobId: string) {
    this.router.navigate(['/job', jobId]);
  }

}
