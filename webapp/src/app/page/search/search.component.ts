import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from 'src/app/data/jobs';
import { DataService } from 'src/app/service/data.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  type: string = '';
  jobList: Job[] = [];
  filteredJobList: Job[] = [];
  top5Jobs: Job[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  defaultImageUrl: string = 'assets/images/default-company.png';
  Math = Math; // For use in template
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalJobs: number = 0;
  totalPages: number = 0;

  // Filters
  searchQuery: string = '';

  // Sorting
  sortBy: 'latest' | 'salary' | 'views' = 'latest';
  
  // UI State
  
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state) {
      const data = currentNavigation.extras.state as { data: { key1: string } };
      this.type = data.data.key1;
    }
  }

  ngOnInit(): void {
    // Debounced search
    this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.searchQuery = query;
        this.currentPage = 1;
        this.applyFilters();
      });

    this.getAllJobs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllJobs() {
    console.log('Starting getAllJobs...');
    this.isLoading = true;
    this.error = null;
    
    this.dataService.getAllJobs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (jobs: Job[]) => {
          console.log('Jobs received:', jobs.length);
          
          this.jobList = jobs.map(job => ({
            ...job,
            img_url: this.validateImageUrl(job.img_url),
            post_date: this.validateDate(job.post_date),
            deadline: this.validateDate(job.deadline)
          }));
          
          // Extract filter options
          this.extractFilterOptions();
          
          if (this.jobList.length > 0) {
            console.log('Processed jobs:', this.jobList.length);
            this.applyFilters();
            this.getTopJobs();
            this.isLoading = false;
          } else {
            console.log('No jobs received');
            this.error = 'No jobs available at the moment.';
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error fetching jobs:', err);
          this.error = "Failed to load jobs. Please try again later.";
          this.isLoading = false;
        }
      });
  }

  /**
   * Extract unique filter options from jobs
   */
  private extractFilterOptions(): void {
    // Filters removed - only search is available now
  }

  /**
   * Apply all filters and sorting
   */
  private applyFilters(): void {
    let filtered = [...this.jobList];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company_name.toLowerCase().includes(query) ||
        job.mini_description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    this.applySorting(filtered);

    // Calculate pagination
    this.totalJobs = filtered.length;
    this.totalPages = Math.ceil(this.totalJobs / this.pageSize);

    // Apply pagination
    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredJobList = filtered.slice(start, start + this.pageSize);

    console.log(`Filtered: ${this.totalJobs} jobs, Page: ${this.currentPage}/${this.totalPages}`);
  }

  /**
   * Apply sorting to filtered jobs
   */
  private applySorting(jobs: Job[]): void {
    switch (this.sortBy) {
      case 'latest':
        jobs.sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime());
        break;
      case 'salary':
        jobs.sort((a, b) => (b.salary || 0) - (a.salary || 0));
        break;
      case 'views':
        jobs.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }
  }

  /**
   * Handle search input
   */
  onSearchChange(query: string): void {
    this.searchSubject$.next(query);
  }

  /**
   * Handle salary range slider change
   */
  onSalaryRangeChange(minSalary: number, maxSalary: number): void {
    // Removed - filters no longer available
  }

  /**
   * Handle sort change
   */
  onSortChange(sortBy: 'latest' | 'salary' | 'views'): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
      window.scrollTo(0, 0);
    }
  }

  /**
   * Next page
   */
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  /**
   * Previous page
   */
  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  /**
   * Reset all filters
   */
  resetFilters(): void {
    this.searchQuery = '';
    this.sortBy = 'latest';
    this.currentPage = 1;
    this.pageSize = 10;
    this.applyFilters();
  }

  /**
   * Toggle filter panel visibility
   */
  toggleFilters(): void {
    // Removed - filters no longer available
  }

  getTopJobs() {
    console.log('Sorting jobs for top 5...');
    if (this.jobList.length === 0) {
      console.log('No jobs to sort');
      return;
    }

    try {
      const sortedJobs = [...this.jobList];
      sortedJobs.sort((a, b) => {
        const dateA = new Date(a.post_date || new Date()).getTime();
        const dateB = new Date(b.post_date || new Date()).getTime();
        return dateB - dateA;
      });

      this.top5Jobs = sortedJobs.slice(0, 5);
      console.log('Top 5 jobs selected:', this.top5Jobs);
    } catch (error) {
      console.error('Error in getTopJobs:', error);
    }
  }

  navigateToJob(jobId: string) {
    window.scrollTo(0, 0);
    this.router.navigate(['/job', jobId]);
  }

  private validateImageUrl(url: string): string {
    if (!url) return this.defaultImageUrl;
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
    return diffDays <= 3;
  }

  /**
   * Get page numbers for pagination display
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}
