import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { SnackbarService } from '../core/snackbar.service';
import { BlogPost } from 'src/app/service/data.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-blog-management',
  templateUrl: './blog-management.component.html',
  styleUrls: ['./blog-management.component.css']
})
export class BlogManagementComponent implements OnInit {
  @Output() blogCreated = new EventEmitter<void>();
  @Output() blogUpdated = new EventEmitter<void>();
  
  blogForm!: FormGroup;
  blogs: BlogPost[] = [];
  isEditing = false;
  currentBlogId: string | null = null;
  blogToEdit: BlogPost | null = null;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private storage: AngularFireStorage,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadBlogs();
    
    // Check if we're editing an existing blog (passed via dialog data)
    if (this.data && this.data.blog && this.data.isEdit) {
      this.blogToEdit = this.data.blog;
      if (this.blogToEdit) {
        this.editBlog(this.blogToEdit);
      }
    }
  }

  private initForm() {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      summary: ['', [Validators.required]],
      author: ['', [Validators.required]],
      category: ['', [Validators.required]],
      tags: [''],
      imageUrl: [''],
      status: ['draft'],
      readTime: [''],
      featured: [false],
      seoMetadata: this.fb.group({
        metaTitle: [''],
        metaDescription: [''],
        keywords: ['']
      })
    });
  }

  loadBlogs() {
    // Show loading message
    this.snackbar.openSnackBar('Loading blogs...');
    
    this.dataService.getAllBlogs(false).subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        if (blogs.length === 0) {
          this.snackbar.openSnackBar('No blogs found');
        } else {
          this.snackbar.openSnackBar(`Loaded ${blogs.length} blogs`);
        }
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.snackbar.openSnackBar('Error loading blogs: ' + error.message);
      }
    });
  }

  onSubmit() {
    if (!this.blogForm.valid) {
      this.snackbar.openSnackBar('Please fill in all required fields');
      return;
    }

    // Check if an image is uploaded
    if (!this.blogForm.get('imageUrl')?.value) {
      this.snackbar.openSnackBar('Please upload a featured image');
      return;
    }

    const blogData = this.prepareBlogData();
    
    if (this.isEditing && this.currentBlogId) {
      this.updateBlog(blogData);
    } else {
      this.createBlog(blogData);
    }
  }

  private prepareBlogData(): BlogPost {
    const formValue = this.blogForm.value;
    const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [];
    
    // Create the blog data object
    const blogData: BlogPost = {
      title: formValue.title,
      content: formValue.content,
      summary: formValue.summary,
      author: formValue.author,
      category: formValue.category,
      readTime: formValue.readTime || '5 min read',
      image: formValue.imageUrl || '', // Use the uploaded image URL
      tags: tags,
      date: new Date(), // Always use current date
      lastModified: new Date(),
      likes: 0,
      views: 0,
      isPublished: formValue.status === 'published'
    };

    // Add ID if editing
    if (this.isEditing && this.currentBlogId) {
      blogData.id = this.currentBlogId;
    }

    return blogData;
  }

  createBlog(blogData: BlogPost) {
    // Show loading message
    this.snackbar.openSnackBar('Creating blog post...');
    
    // Ensure we have the image URL
    if (!blogData.image && this.blogForm.get('imageUrl')?.value) {
      blogData.image = this.blogForm.get('imageUrl')?.value;
    }

    this.dataService.addBlog(blogData).subscribe(
      () => {
        this.snackbar.openSnackBar('Blog created successfully');
        this.resetForm();
        this.loadBlogs();
        this.blogCreated.emit(); // Emit create event
      },
      (error) => {
        console.error('Error creating blog:', error);
        this.snackbar.openSnackBar('Error creating blog: ' + error.message);
      }
    );
  }

  updateBlog(blogData: BlogPost) {
    if (!this.currentBlogId) return;
    
    this.dataService.updateBlog(blogData).subscribe(
      () => {
        this.snackbar.openSnackBar('Blog updated successfully');
        this.resetForm();
        this.loadBlogs();
        this.blogUpdated.emit(); // Emit update event
      },
      (error) => {
        this.snackbar.openSnackBar('Error updating blog: ' + error);
      }
    );
  }

  deleteBlog(blog: BlogPost) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.dataService.deleteBlog(blog).subscribe(
        () => {
          this.snackbar.openSnackBar('Blog deleted successfully');
          this.loadBlogs();
        },
        (error) => {
          this.snackbar.openSnackBar('Error deleting blog: ' + error);
        }
      );
    }
  }

  editBlog(blog: BlogPost) {
    this.isEditing = true;
    this.currentBlogId = blog.id || null;
    this.blogForm.patchValue({
      ...blog,
      tags: blog.tags ? blog.tags.join(', ') : '',
      imageUrl: blog.image,
      status: blog.isPublished ? 'published' : 'draft',
      seoMetadata: {
        metaTitle: '',
        metaDescription: '',
        keywords: ''
      }
    });
  }

  resetForm() {
    this.blogForm.reset();
    this.isEditing = false;
    this.currentBlogId = null;
    this.initForm();
  }

  async uploadImage(event: any) {
    try {
      event.preventDefault(); // Prevent form submission
      
      // Check authentication
      const auth = this.storage.storage.app.auth().currentUser;
      if (!auth) {
        this.snackbar.openSnackBar('Please sign in to upload images');
        return;
      }

      const file = event.target.files[0];
      
      if (!file) {
        console.log('No file selected');
        return;
      }

      console.log('Selected file:', file.name, 'Type:', file.type, 'Size:', file.size);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.snackbar.openSnackBar('Please select an image file');
        return;
      }

      // Show loading message
      this.snackbar.openSnackBar('Starting image upload...');

      // Create a unique file path in public folder
      const filePath = `public/${new Date().getTime()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      console.log('Upload path:', filePath);

      try {
        // Get storage reference
        const fileRef = this.storage.ref(filePath);
        console.log('Storage reference created');

        // Start upload
        const task = this.storage.upload(filePath, file);
        console.log('Upload task created');

        // Monitor upload progress
        task.percentageChanges().subscribe({
          next: (percentage) => {
            if (percentage) {
              console.log('Upload progress:', percentage);
              this.snackbar.openSnackBar(`Uploading: ${Math.round(percentage)}%`);
            }
          },
          error: (error) => {
            console.error('Error monitoring upload progress:', error);
          }
        });

        // Wait for upload to complete
        console.log('Waiting for upload to complete...');
        await task.snapshotChanges().toPromise();
        console.log('Upload completed');

        // Get download URL
        console.log('Getting download URL...');
        const url = await fileRef.getDownloadURL().toPromise();
        console.log('Download URL received:', url);

        // Update the form
        this.blogForm.patchValue({ imageUrl: url });
        this.snackbar.openSnackBar('Image uploaded successfully!');

      } catch (error: any) {
        console.error('Error during upload process:', error);
        const errorMessage = error.message || 'Unknown error';
        this.snackbar.openSnackBar('Error uploading image: ' + errorMessage);
        throw error;
      }

    } catch (error) {
      console.error('Top level error in uploadImage:', error);
      this.snackbar.openSnackBar('Error uploading image. Please try again.');
      
      // Clear the file input
      const fileInput = event.target as HTMLInputElement;
      fileInput.value = '';
    }
  }
}