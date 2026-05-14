import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService, BlogPost } from '../../service/data.service';
import { SeoService } from '../../service/seo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit, OnDestroy {
  allBlogPosts: BlogPost[] = [];
  filteredBlogPosts: BlogPost[] = [];
  categories: { name: string; count: number }[] = [];
  selectedCategory: string = 'All';
  loading = true;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 9;
  totalBlogs: number = 0;
  totalPages: number = 0;

  // Search & Filter
  searchQuery: string = '';
  sortBy: 'latest' | 'popular' | 'trending' = 'latest';

  // UI State
  showFilters: boolean = false;

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(private dataService: DataService, private seo: SeoService) {}

  ngOnInit() {
    this.seo.updatePage({
      title: 'Career Blog - Tips, Guides & Job Market Insights',
      description: 'Read career advice, interview tips, resume guides, and job market insights for freshers and graduates on Career Yojna blog.',
      keywords: 'career tips, interview preparation, resume guide, fresher career advice, job market India',
      canonicalPath: '/blogs'
    });

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

    this.loadBlogs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBlogs() {
    this.loading = true;
    this.dataService.getAllBlogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe(posts => {
        this.allBlogPosts = posts;
        console.log('Blogs loaded:', posts.length);
        this.updateCategories();
        this.applyFilters();
        this.loading = false;
      });
  }

  /**
   * Extract unique categories from blogs
   */
  private updateCategories() {
    const uniqueCategories = [...new Set(this.allBlogPosts.map(post => post.category))];

    this.categories = [
      { name: 'All', count: this.allBlogPosts.length },
      ...uniqueCategories.map(category => ({
        name: category,
        count: this.allBlogPosts.filter(post => post.category === category).length
      }))
    ];
  }

  /**
   * Filter by category
   */
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Handle search input
   */
  onSearchChange(query: string): void {
    this.searchSubject$.next(query);
  }

  /**
   * Handle sort change
   */
  onSortChange(sortBy: 'latest' | 'popular' | 'trending'): void {
    this.sortBy = sortBy;
    this.currentPage = 1;
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
   * Apply all filters and sorting
   */
  private applyFilters(): void {
    let filtered = [...this.allBlogPosts];

    // Category filter
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === this.selectedCategory);
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    this.applySorting(filtered);

    // Calculate pagination
    this.totalBlogs = filtered.length;
    this.totalPages = Math.ceil(this.totalBlogs / this.pageSize);

    // Apply pagination
    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredBlogPosts = filtered.slice(start, start + this.pageSize);

    console.log(`Filtered: ${this.totalBlogs} blogs, Page: ${this.currentPage}/${this.totalPages}`);
  }

  /**
   * Apply sorting to filtered blogs
   */
  private applySorting(blogs: BlogPost[]): void {
    switch (this.sortBy) {
      case 'latest':
        blogs.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'popular':
        blogs.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'trending':
        blogs.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }
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
    this.selectedCategory = 'All';
    this.sortBy = 'latest';
    this.currentPage = 1;
    this.pageSize = 9;
    this.applyFilters();
  }

  /**
   * Toggle filter panel visibility
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
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

  trackByBlogId(index: number, blog: BlogPost): string {
    return blog.id || index.toString();
  }
}