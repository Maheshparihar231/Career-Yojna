import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/service/seo.service';

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

interface FaqCategory {
  title: string;
  icon: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'FAQ - Frequently Asked Questions',
      description: 'Find answers to common questions about Career Yojna, job applications, account features, and more. Get help with your job search.',
      keywords: 'career yojna faq, help, how to apply jobs, fresher job questions',
      canonicalPath: '/faq'
    });
  }

  categories: FaqCategory[] = [
    {
      title: 'Getting Started',
      icon: 'rocket_launch',
      items: [
        {
          question: 'What is Career Yojna?',
          answer: 'Career Yojna is a platform that helps students and fresh graduates discover off-campus job opportunities from verified companies across India. We curate and list jobs specifically targeted at freshers.',
          open: false
        },
        {
          question: 'Is Career Yojna free to use?',
          answer: 'Yes, Career Yojna is completely free for job seekers. You can browse jobs, filter by type, and apply directly through the company links without any charges.',
          open: false
        },
        {
          question: 'Do I need to create an account to browse jobs?',
          answer: 'No, you can browse all job listings without creating an account. Simply visit the search page and start exploring opportunities.',
          open: false
        }
      ]
    },
    {
      title: 'Jobs & Applications',
      icon: 'work_outline',
      items: [
        {
          question: 'How do I apply for a job?',
          answer: 'Click on any job listing to view its details. You\'ll find an "Apply Now" button that redirects you to the company\'s official application page where you can submit your application directly.',
          open: false
        },
        {
          question: 'Are the job listings verified?',
          answer: 'Yes, we verify all job listings before publishing them. We ensure they come from legitimate companies with active hiring processes.',
          open: false
        },
        {
          question: 'How often are new jobs posted?',
          answer: 'We update our job listings daily. New opportunities are added as soon as they become available from our partner companies.',
          open: false
        },
        {
          question: 'Can I filter jobs by type (remote, internship, etc.)?',
          answer: 'Yes! Use the filter chips on the search page to filter by Full-time, Internship, Remote, or Part-time positions. You can also use the search bar to find jobs by title or company name.',
          open: false
        },
        {
          question: 'What does "Off-Campus" mean?',
          answer: 'Off-campus jobs are positions that companies offer through their career portals or job boards, independent of college placement cells. Anyone meeting the eligibility criteria can apply.',
          open: false
        }
      ]
    },
    {
      title: 'Account & Profile',
      icon: 'person_outline',
      items: [
        {
          question: 'Will there be profile/account features in the future?',
          answer: 'We\'re working on adding profile features that will let you save jobs, set alerts, and track your applications. Stay tuned for updates!',
          open: false
        },
        {
          question: 'How can I get notified about new jobs?',
          answer: 'Currently, you can follow us on our social media channels (Telegram, Instagram) for instant job updates. We\'re also building an email notification system.',
          open: false
        }
      ]
    },
    {
      title: 'Technical & Support',
      icon: 'help_outline',
      items: [
        {
          question: 'A job link is not working. What should I do?',
          answer: 'If a job application link is broken or expired, it likely means the company has closed that position. We regularly clean up expired listings, but if you spot one, please report it via email.',
          open: false
        },
        {
          question: 'How can I contact the Career Yojna team?',
          answer: 'You can reach us at careeryojnaofficial@gmail.com for any queries, suggestions, or to report issues. We typically respond within 24 hours.',
          open: false
        },
        {
          question: 'Is my data safe on Career Yojna?',
          answer: 'We take privacy seriously. We don\'t collect personal data beyond basic analytics. Job applications happen directly on company websites, so your application data goes to them, not us.',
          open: false
        }
      ]
    }
  ];

  toggleItem(item: FaqItem): void {
    item.open = !item.open;
  }
}
