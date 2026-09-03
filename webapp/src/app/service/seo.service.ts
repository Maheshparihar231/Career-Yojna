import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Job } from '../data/jobs';

export interface PageSeo {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalPath?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private baseUrl = 'https://career-yojna.online';
  private siteName = 'Career Yojna';
  private defaultImage = `${this.baseUrl}/assets/images/Career_Yojna.png`;

  constructor(private title: Title, private meta: Meta, private router: Router) {}

  updatePage(seo: PageSeo): void {
    const fullTitle = `${seo.title} | ${this.siteName}`;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: seo.description });
    if (seo.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seo.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:image', content: seo.ogImage || this.defaultImage });
    this.meta.updateTag({ property: 'og:url', content: `${this.baseUrl}${seo.canonicalPath || this.router.url}` });

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: seo.ogImage || this.defaultImage });

    // Canonical
    this.updateCanonical(seo.canonicalPath || this.router.url);
  }

  updateJobPage(title: string, company: string, location: string, salary?: number): void {
    const description = `Apply for ${title} at ${company}${location ? ` in ${location}` : ''}${salary ? `. Salary: ₹${salary.toLocaleString()}` : ''}. Off-campus opportunity for freshers.`;
    this.updatePage({
      title: `${title} - ${company}`,
      description,
      keywords: `${title}, ${company}, ${location}, fresher jobs, off campus`
    });
  }

  /** Inject JobPosting JSON-LD structured data */
  setJobPostingSchema(job: Job): void {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      'title': job.title,
      'description': job.description || job.mini_description,
      'datePosted': job.post_date ? new Date(job.post_date).toISOString().split('T')[0] : undefined,
      'validThrough': job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : undefined,
      'employmentType': this.mapJobType(job.job_type),
      'hiringOrganization': {
        '@type': 'Organization',
        'name': job.company_name,
        'logo': job.img_url || this.defaultImage
      },
      'jobLocation': {
        '@type': 'Place',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': job.location || 'India',
          'addressCountry': 'IN'
        }
      },
      'baseSalary': job.salary ? {
        '@type': 'MonetaryAmount',
        'currency': 'INR',
        'value': {
          '@type': 'QuantitativeValue',
          'value': job.salary,
          'unitText': 'YEAR'
        }
      } : undefined,
      'qualifications': job.qualification || undefined,
      'skills': job.skills_required?.join(', ') || undefined,
      'experienceRequirements': job.experience || undefined
    };

    // Remove undefined values
    Object.keys(schema).forEach(key => schema[key] === undefined && delete schema[key]);

    this.setJsonLd(schema, 'job-posting-schema');
  }

  /** Inject BlogPosting JSON-LD structured data */
  setBlogPostingSchema(blog: { title: string; summary: string; content: string; author: string; date: Date; image: string; category: string; tags?: string[]; id?: string }): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': blog.title,
      'description': blog.summary,
      'author': {
        '@type': 'Person',
        'name': blog.author
      },
      'publisher': {
        '@type': 'Organization',
        'name': this.siteName,
        'logo': {
          '@type': 'ImageObject',
          'url': this.defaultImage
        }
      },
      'datePublished': blog.date ? new Date(blog.date).toISOString() : undefined,
      'image': blog.image || this.defaultImage,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${this.baseUrl}/blog/${blog.id || ''}`
      },
      'keywords': blog.tags?.join(', ') || blog.category,
      'articleSection': blog.category
    };

    this.setJsonLd(schema, 'blog-posting-schema');
  }

  /** Remove structured data when leaving a page */
  removeStructuredData(id: string): void {
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }
  }

  private setJsonLd(schema: object, id: string): void {
    // Remove existing schema with same id
    this.removeStructuredData(id);

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  private mapJobType(jobType: string): string {
    const typeMap: Record<string, string> = {
      'Full-time': 'FULL_TIME',
      'Part-time': 'PART_TIME',
      'Internship': 'INTERN',
      'Remote': 'FULL_TIME',
      'Contract': 'CONTRACTOR'
    };
    return typeMap[jobType] || 'FULL_TIME';
  }

  private updateCanonical(path: string): void {
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', `${this.baseUrl}${path}`);
  }
}
