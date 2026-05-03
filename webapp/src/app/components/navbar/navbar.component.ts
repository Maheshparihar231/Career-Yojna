import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() themeToggle = new EventEmitter<void>();
  isLoggedIn = false;
  currentUser: User | null = null;
  mobileMenuOpen = false;
  private authSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  goToJobs() {
    const data = 'jobs';
    this.router.navigate(['/search'], { state: { data } });
  }

  async signOut() {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  onThemeToggle(): void {
    this.themeToggle.emit();
  }
}
