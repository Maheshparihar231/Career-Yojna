import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async submit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.signIn(email, password);
        this.router.navigate(['/data']); // Redirect to data page after login
      } catch (error) {
        console.error('Login failed:', error);
        // Error handling is done in the auth service
      } finally {
        this.isLoading = false;
      }
    } else {
      console.log('Form is invalid');
      this.showValidationErrors();
    }
  }

  // Method to show validation errors
  showValidationErrors() {
    const form = this.loginForm;
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) {
        console.log(`Validation error for ${key}:`, control.errors);
      }
    });
  }

  // Get error message for a specific field
  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  async resetPassword() {
    const email = this.loginForm.get('email')?.value;
    if (email) {
      try {
        await this.authService.resetPassword(email);
      } catch (error) {
        console.error('Password reset failed:', error);
      }
    } else {
      console.log('Please enter your email first');
    }
  }
}
