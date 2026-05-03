import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Job } from '../data/jobs';
import {
  Observable,
  map,
  shareReplay,
  BehaviorSubject,
  retry,
  catchError,
  of,
  tap
} from 'rxjs';
import { APP_CONFIG } from '../config/app-config';

export interface BlogPost {
  id?: string;
  title: string;
  date: Date;
  category: string;
  image: string;
  author: string;
  readTime: string;
  summary: string;
  content: string;
  views?: number;
  likes?: number;
  tags?: string[];
  isPublished?: boolean;
  lastModified?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly JOBS_COLLECTION = APP_CONFIG.firestore.collections.jobs;
  private readonly BLOGS_COLLECTION = APP_CONFIG.firestore.collections.blogs;
  private readonly RETRY_CONFIG = { count: 3, delay: 1000 };

  // Caching & State Management
  private allJobs$!: Observable<Job[]>;
  private allBlogs$!: Observable<BlogPost[]>;

  // Loading & Error States
  public isLoadingJobs$ = new BehaviorSubject<boolean>(false);
  public isLoadingBlogs$ = new BehaviorSubject<boolean>(false);
  public jobsError$ = new BehaviorSubject<string | null>(null);
  public blogsError$ = new BehaviorSubject<string | null>(null);

  constructor(private afs: AngularFirestore) {
    this.initializeCaching();
  }

  isInitialized(): boolean {
    return !!this.afs;
  }

  /**
   * Initialize cached read-only data streams.
   */
  private initializeCaching(): void {
    // Cache jobs with shareReplay
    this.allJobs$ = this.createJobsSource().pipe(
      tap(() => this.isLoadingJobs$.next(false)),
      catchError(error => {
        console.error('Jobs fetch error:', error);
        this.jobsError$.next(error.message || 'Failed to load jobs');
        this.isLoadingJobs$.next(false);
        return of([]);
      }),
      shareReplay(1)
    );

    // Cache blogs with shareReplay
    this.allBlogs$ = this.createBlogsSource().pipe(
      tap(() => this.isLoadingBlogs$.next(false)),
      catchError(error => {
        console.error('Blogs fetch error:', error);
        this.blogsError$.next(error.message || 'Failed to load blogs');
        this.isLoadingBlogs$.next(false);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  /**
   * Get all jobs with caching.
   */
  getAllJobs(): Observable<Job[]> {
    this.isLoadingJobs$.next(true);
    return this.allJobs$;
  }

  /**
   * Get jobs with pagination support
   */
  getJobsPaginated(pageSize: number = 10, pageNumber: number = 0): Observable<Job[]> {
    return this.getAllJobs().pipe(
      map(jobs => {
        const start = pageNumber * pageSize;
        return jobs.slice(start, start + pageSize);
      })
    );
  }

  /**
   * Get job by ID.
   */
  getJobById(jobId: string): Observable<Job | undefined> {
    return this.afs.collection(this.JOBS_COLLECTION).doc(jobId).valueChanges().pipe(
      map(data => data ? this.transformJob(data as Record<string, any>) : undefined),
      catchError(error => {
        console.error('Error fetching job:', error);
        return of(undefined);
      })
    );
  }

  /**
   * Get trending jobs sorted by views
   */
  getTrendingJobs(limit: number = 5): Observable<Job[]> {
    return this.getAllJobs().pipe(
      map(jobs =>
        jobs
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, limit)
      )
    );
  }

  /**
   * Search jobs by multiple criteria
   */
  searchJobs(query: string, filters?: {
    jobType?: string;
    location?: string;
    minSalary?: number;
  }): Observable<Job[]> {
    const lowerQuery = query.toLowerCase();
    
    return this.getAllJobs().pipe(
      map(jobs =>
        jobs.filter(job => {
          const matchesQuery =
            job.title.toLowerCase().includes(lowerQuery) ||
            job.company_name.toLowerCase().includes(lowerQuery) ||
            job.mini_description.toLowerCase().includes(lowerQuery) ||
            job.location.toLowerCase().includes(lowerQuery);

          if (!matchesQuery) return false;

          // Apply filters if provided
          if (filters?.jobType && job.job_type !== filters.jobType) return false;
          if (filters?.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
          if (filters?.minSalary && (job.salary || 0) < filters.minSalary) return false;

          return true;
        })
      )
    );
  }

  /**
   * Private: Create jobs data source
   */
  private createJobsSource(): Observable<Job[]> {
    console.log('DataService: Fetching jobs from Firestore...');
    this.isLoadingJobs$.next(true);
    
    return this.afs.collection('/Jobs').snapshotChanges().pipe(
      map(snapshots => {
        console.log('DataService: Raw data count:', snapshots?.length || 0);
        
        return snapshots.map(doc => {
          const data = doc.payload.doc.data() as Record<string, any>;
          const id = doc.payload.doc.id;
          return this.transformJob(data, id);
        });
      }),
      retry(this.RETRY_CONFIG)
    );
  }

  /**
   * Private: Transform raw Firestore job data to typed Job
   */
  private transformJob(data: Record<string, any>, id?: string): Job {
    return {
      id: id || data['id'],
      title: data['title'] || 'Untitled Position',
      company_name: data['company_name'] || 'Company Name Not Available',
      mini_description: data['mini_description'] || 'No description available',
      post_date: data['post_date'] ? new Date(data['post_date']) : new Date(),
      img_url: data['img_url'] || 'assets/images/default-company.png',
      description: data['description'] || '',
      apply_link: data['apply_link'] || '',
      role: data['role'] || '',
      department: data['department'] || '',
      remote: data['remote'] || '',
      location: data['location'] || '',
      job_type: data['job_type'] || '',
      salary: data['salary'] || 0,
      experience: data['experience'] || '0',
      qualification: data['qualification'] || '',
      skills_required: Array.isArray(data['skills_required']) ? data['skills_required'] : [],
      benefits: Array.isArray(data['benefits']) ? data['benefits'] : [],
      responsibilities: Array.isArray(data['responsibilities']) ? data['responsibilities'] : [],
      requirements: Array.isArray(data['requirements']) ? data['requirements'] : [],
      deadline: data['deadline'] ? new Date(data['deadline']) : new Date(),
      views: data['views'] || 0
    } as Job;
  }

  /**
   * Get blog by ID.
   */
  getBlogById(blogId: string): Observable<BlogPost | undefined> {
    return this.afs.collection(this.BLOGS_COLLECTION).doc(blogId).valueChanges().pipe(
      map(data => data ? this.transformBlog(data as Record<string, any>, blogId) : undefined),
      catchError(error => {
        console.error('Error fetching blog:', error);
        return of(undefined);
      })
    );
  }

  /**
   * Get all blogs with caching
   */
  getAllBlogs(onlyPublished: boolean = true): Observable<BlogPost[]> {
    this.isLoadingBlogs$.next(true);
    
    return this.allBlogs$.pipe(
      map(blogs =>
        onlyPublished ? blogs.filter(blog => blog.isPublished) : blogs
      )
    );
  }

  /**
   * Get blogs with pagination
   */
  getBlogsPaginated(
    pageSize: number = 10,
    pageNumber: number = 0,
    onlyPublished: boolean = true
  ): Observable<BlogPost[]> {
    return this.getAllBlogs(onlyPublished).pipe(
      map(blogs => {
        const start = pageNumber * pageSize;
        return blogs.slice(start, start + pageSize);
      })
    );
  }

  /**
   * Get blogs by category
   */
  getBlogsByCategory(category: string): Observable<BlogPost[]> {
    return this.afs.collection(this.BLOGS_COLLECTION, ref =>
      ref.where('category', '==', category).where('isPublished', '==', true)
    )
      .snapshotChanges()
      .pipe(
        map(snapshots =>
          snapshots
            .map(doc => {
              const data = doc.payload.doc.data() as Record<string, any>;
              const id = doc.payload.doc.id;
              return this.transformBlog(data, id);
            })
            .sort((a, b) => b.date.getTime() - a.date.getTime())
        ),
        retry(this.RETRY_CONFIG),
        catchError(error => {
          console.error('Error fetching blogs by category:', error);
          return of([]);
        })
      );
  }

  /**
   * Search blogs with full-text capability
   */
  searchBlogs(query: string, filters?: {
    category?: string;
    author?: string;
  }): Observable<BlogPost[]> {
    const lowerQuery = query.toLowerCase();
    
    return this.getAllBlogs().pipe(
      map(blogs =>
        blogs.filter(blog => {
          const matchesQuery =
            blog.title.toLowerCase().includes(lowerQuery) ||
            blog.content.toLowerCase().includes(lowerQuery) ||
            blog.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            blog.category.toLowerCase().includes(lowerQuery) ||
            blog.author.toLowerCase().includes(lowerQuery);

          if (!matchesQuery) return false;

          // Apply filters if provided
          if (filters?.category && blog.category !== filters.category) return false;
          if (filters?.author && blog.author !== filters.author) return false;

          return true;
        })
      )
    );
  }

  /**
   * Get latest blogs sorted by date
   */
  getLatestBlogs(limit: number = 5): Observable<BlogPost[]> {
    return this.getAllBlogs().pipe(
      map(blogs =>
        blogs
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, limit)
      )
    );
  }

  /**
   * Get trending blogs sorted by views
   */
  getTrendingBlogs(limit: number = 5): Observable<BlogPost[]> {
    return this.getAllBlogs().pipe(
      map(blogs =>
        blogs
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, limit)
      )
    );
  }

  /**
   * Get related blogs by category
   */
  getRelatedBlogs(
    category: string,
    currentBlogId: string,
    limit: number = 3
  ): Observable<BlogPost[]> {
    return this.getBlogsByCategory(category).pipe(
      map(blogs =>
        blogs
          .filter(blog => blog.id !== currentBlogId)
          .slice(0, limit)
      )
    );
  }

  /**
   * Private: Create blogs data source
   */
  private createBlogsSource(): Observable<BlogPost[]> {
    console.log('DataService: Fetching blogs from Firestore...');
    this.isLoadingBlogs$.next(true);
    
    return this.afs.collection(this.BLOGS_COLLECTION).snapshotChanges().pipe(
      map(snapshots =>
        snapshots.map(doc => {
          const data = doc.payload.doc.data() as Record<string, any>;
          const id = doc.payload.doc.id;
          return this.transformBlog(data, id);
        })
      ),
      retry(this.RETRY_CONFIG)
    );
  }

  /**
   * Private: Transform raw Firestore blog data to typed BlogPost
   */
  private transformBlog(data: Record<string, any>, id?: string): BlogPost {
    return {
      id: id || data['id'],
      title: data['title'] || 'Untitled',
      date: data['date'] ? new Date((data['date'] as any).toDate?.() || data['date']) : new Date(),
      category: data['category'] || 'General',
      image: data['image'] || 'assets/images/default-blog.png',
      author: data['author'] || 'Unknown',
      readTime: data['readTime'] || '5 min read',
      summary: data['summary'] || '',
      content: data['content'] || '',
      views: data['views'] || 0,
      likes: data['likes'] || 0,
      tags: Array.isArray(data['tags']) ? data['tags'] : [],
      isPublished: data['isPublished'] ?? true,
      lastModified: data['lastModified'] ? new Date((data['lastModified'] as any).toDate?.() || data['lastModified']) : new Date()
    } as BlogPost;
  }

}
