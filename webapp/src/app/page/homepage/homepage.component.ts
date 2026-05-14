import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'Off-Campus Jobs for Freshers & Graduates in India',
      description: 'Discover verified off-campus job opportunities from top companies across India. Browse full-time, internship, and remote positions for freshers and recent graduates.',
      keywords: 'off campus jobs, fresher jobs India, graduate jobs, entry level jobs, campus placement alternatives',
      canonicalPath: '/home'
    });
  }
}
