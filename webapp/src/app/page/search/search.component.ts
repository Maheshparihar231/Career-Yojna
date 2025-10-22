import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from 'src/app/data/jobs';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  type: string = '';
  jobList: Job[] = [];
  top5Jobs: Job[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  defaultImageUrl: string = 'assets/images/default-company.png'; // Add a default image to your assets

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state) {
      const data = currentNavigation.extras.state as { data: { key1: string } };
      this.type = data.data.key1;
    }
  }

  ngOnInit(): void {
    this.getAllJobs();
  }

  getAllJobs() {
    console.log('Starting getAllJobs...');
    this.isLoading = true;
    this.error = null;
    
    this.dataService.getAllJobs().subscribe({
      next: (jobs: Job[]) => {
        console.log('Jobs received:', jobs.length);
        console.log('Raw jobs data:', jobs);
        
        this.jobList = jobs.map(job => ({
          ...job,
          img_url: this.validateImageUrl(job.img_url),
          post_date: this.validateDate(job.post_date),
          deadline: this.validateDate(job.deadline)
        }));
        
        if (this.jobList.length > 0) {
          console.log('Processed jobs:', this.jobList.length);
          console.log('Sample job:', this.jobList[0]);
          this.getTopJobs();
          this.isLoading = false;  // Only set loading to false if we have jobs
        } else {
          console.log('No jobs received');
          this.error = 'No jobs available at the moment.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.error = "Failed to load jobs. Please try again later.";
      },
      complete: () => {
        console.log('Setting loading to false');
        this.isLoading = false;
      }
    });
  }

  getTopJobs() {
    console.log('Sorting jobs for top 5...');
    if (this.jobList.length === 0) {
      console.log('No jobs to sort');
      return;
    }

    try {
      // Create a copy of the jobList
      const sortedJobs = [...this.jobList];
      
      // Sort by date
      sortedJobs.sort((a, b) => {
        const dateA = new Date(a.post_date || new Date()).getTime();
        const dateB = new Date(b.post_date || new Date()).getTime();
        return dateB - dateA;
      });

      // Get top 5
      this.top5Jobs = sortedJobs.slice(0, 5);
      console.log('Top 5 jobs selected:', this.top5Jobs);
    } catch (error) {
      console.error('Error in getTopJobs:', error);
    }
  }

  navigateToJob(jobId: string) {
    this.router.navigate(['/job', jobId]);
  }

  private validateImageUrl(url: string): string {
    if (!url) return this.defaultImageUrl;
    
    // Basic URL validation
    try {
      new URL(url);
      return url;
    } catch {
      return this.defaultImageUrl;
    }
  }

  private validateDate(date: any): Date {
    if (!date) return new Date();
    
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }

  trackByJobId(index: number, job: Job): string {
    return job.id;
  }

  isNewJob(postDate: Date): boolean {
    const now = new Date();
    const jobDate = new Date(postDate);
    const diffTime = Math.abs(now.getTime() - jobDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3; // Consider jobs posted within last 3 days as new
  }
}
