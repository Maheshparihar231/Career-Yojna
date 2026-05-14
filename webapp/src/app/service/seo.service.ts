import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface PageSeo {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalPath?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private baseUrl = 'https://careeryojna.com';
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
