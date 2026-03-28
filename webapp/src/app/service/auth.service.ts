import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { SnackbarService } from '../components/core/snackbar.service';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackbar: SnackbarService
  ) {
    // Listen to authentication state changes
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userSubject.next({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || undefined
        });
      } else {
        this.userSubject.next(null);
      }
    });
  }

  // Get current user
  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.afAuth.currentUser;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      
      // Update display name if provided
      if (displayName && result.user) {
        await result.user.updateProfile({ displayName });
      }
      
      this.snackbar.openSnackBar('Account created successfully!');
      return result;
    } catch (error: any) {
      console.error('Sign up error:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.snackbar.openSnackBar('Signed in successfully!');
      return result;
    } catch (error: any) {
      console.error('Sign in error:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.snackbar.openSnackBar('Signed out successfully!');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Sign out error:', error);
      this.snackbar.openSnackBar('Error signing out');
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      this.snackbar.openSnackBar('Password reset email sent!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  // Handle authentication errors
  private handleAuthError(error: any): void {
    let message = 'An error occurred';
    
    switch (error.code) {
      case 'auth/configuration-not-found':
        message = 'Firebase Authentication is not enabled. Please enable it in Firebase Console.';
        break;
      case 'auth/email-already-in-use':
        message = 'Email is already in use';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password accounts are not enabled. Please enable Email/Password authentication in Firebase Console.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'auth/user-disabled':
        message = 'User account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'No user found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your internet connection';
        break;
      default:
        message = error.message || 'Authentication failed';
    }
    
    this.snackbar.openSnackBar(message);
  }
}
