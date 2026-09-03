import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

type ThemeMode = 'light' | 'dark';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'webapp';
  theme: ThemeMode = 'dark';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedTheme = this.getStoredTheme();
    this.applyTheme(storedTheme);
    this.trackPageViews();
  }

  toggleTheme(): void {
    this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  private getStoredTheme(): ThemeMode {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const storedTheme = window.localStorage.getItem('career-yojna-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    return 'dark';
  }

  private applyTheme(theme: ThemeMode): void {
    this.theme = theme;

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('career-yojna-theme', theme);
    }
  }

  private trackPageViews(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      const gtag = (window as any).gtag;
      if (typeof gtag === 'function') {
        gtag('config', 'G-PCHPFX5G5T', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
}
