import { Component, OnInit } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'webapp';
  theme: ThemeMode = 'light';

  ngOnInit(): void {
    const storedTheme = this.getStoredTheme();
    this.applyTheme(storedTheme);
  }

  toggleTheme(): void {
    this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  private getStoredTheme(): ThemeMode {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const storedTheme = window.localStorage.getItem('career-yojna-theme');
    return storedTheme === 'dark' ? 'dark' : 'light';
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
}
