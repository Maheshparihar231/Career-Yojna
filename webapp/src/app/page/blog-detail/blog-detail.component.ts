import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, BlogPost } from '../../service/data.service';
import { SeoService } from '../../service/seo.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: BlogPost | null = null;
  relatedBlogs: BlogPost[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const blogId = params['id'];
      if (blogId) {
        this.loadBlog(blogId);
      }
    });
  }

  private loadBlog(blogId: string): void {
    this.loading = true;
    this.error = '';

    this.dataService.getBlogById(blogId).subscribe({
      next: (blog) => {
        if (blog) {
          this.blog = blog;
          this.seo.updatePage({
            title: `${blog.title} - Career Yojna Blog`,
            description: blog.summary,
            keywords: blog.tags?.join(', ') || blog.category,
            canonicalPath: `/blog/${blogId}`,
            ogImage: blog.image
          });
          this.seo.setBlogPostingSchema({ ...blog, id: blogId });
          this.loadRelatedBlogs(blog.category, blogId);
        } else {
          this.error = 'Blog post not found';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load blog post';
        this.loading = false;
      }
    });
  }

  private loadRelatedBlogs(category: string, currentId: string): void {
    this.dataService.getRelatedBlogs(category, currentId, 3).subscribe({
      next: (blogs) => {
        this.relatedBlogs = blogs;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/blogs']);
  }

  navigateToBlog(blogId: string | undefined): void {
    if (blogId) {
      this.router.navigate(['/blog', blogId]);
    }
  }
}
