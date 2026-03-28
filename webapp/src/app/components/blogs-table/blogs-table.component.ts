import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DataService, BlogPost } from '../../service/data.service';
import { BlogManagementComponent } from '../blog-management/blog-management.component';
import { SnackbarService } from '../core/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blogs-table',
  templateUrl: './blogs-table.component.html',
  styleUrls: ['./blogs-table.component.css']
})
export class BlogsTableComponent implements OnInit, OnDestroy {
  @Input() showEditDelete: boolean = false;
  
  displayedColumns: string[] = ['title', 'author', 'category', 'date', 'status', 'views'];
  dataSource!: MatTableDataSource<BlogPost>;
  private blogsSubscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {
    // Initialize with empty data
    this.dataSource = new MatTableDataSource<BlogPost>([]);
  }

  ngOnInit() {
    if (this.showEditDelete) {
      this.displayedColumns.push('actions');
    }
    this.loadBlogs();
  }

  ngOnDestroy() {
    if (this.blogsSubscription) {
      this.blogsSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadBlogs() {
    this.blogsSubscription = this.dataService.getAllBlogs(false).subscribe({
      next: (blogs) => {
        this.dataSource.data = blogs;
        console.log('Loaded blogs:', blogs.length);
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.snackbar.openSnackBar('Error loading blogs: ' + error.message);
      }
    });
  }

  onEdit(blog: BlogPost) {
    const dialogRef = this.dialog.open(BlogManagementComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      maxHeight: '800px',
      data: { blog: blog, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the table after editing
        this.loadBlogs();
        this.snackbar.openSnackBar('Blog updated successfully!');
      }
    });
  }

  onDelete(blog: BlogPost) {
    if (confirm(`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`)) {
      this.dataService.deleteBlog(blog).subscribe({
        next: () => {
          this.snackbar.openSnackBar('Blog deleted successfully');
          this.loadBlogs(); // Refresh the table
        },
        error: (error) => {
          console.error('Error deleting blog:', error);
          this.snackbar.openSnackBar('Error deleting blog: ' + error.message);
        }
      });
    }
  }

  onTogglePublish(blog: BlogPost) {
    const newStatus = !blog.isPublished;
    this.dataService.toggleBlogPublishStatus(blog.id!, newStatus).subscribe({
      next: () => {
        this.snackbar.openSnackBar(`Blog ${newStatus ? 'published' : 'unpublished'} successfully`);
        this.loadBlogs(); // Refresh the table
      },
      error: (error) => {
        console.error('Error toggling blog status:', error);
        this.snackbar.openSnackBar('Error updating blog status: ' + error.message);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Method to refresh data (can be called from parent component)
  refreshData() {
    this.loadBlogs();
  }

  // Format tags for display
  formatTags(tags: string[] | undefined): string {
    if (!tags || tags.length === 0) return 'No tags';
    return tags.join(', ');
  }

  // Get status badge class
  getStatusClass(isPublished: boolean | undefined): string {
    return isPublished ? 'status-published' : 'status-draft';
  }

  // Get status text
  getStatusText(isPublished: boolean | undefined): string {
    return isPublished ? 'Published' : 'Draft';
  }
}