import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signUpForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  async submit() {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      try {
        const { fullName, email, password } = this.signUpForm.value;
        await this.authService.signUp(email, password, fullName);
        this.router.navigate(['/data']); // Redirect to data page after signup
      } catch (error) {
        console.error('Signup failed:', error);
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
    const form = this.signUpForm;
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) {
        console.log(`Validation error for ${key}:`, control.errors);
      }
    });
  }

  // Get error message for a specific field
  getErrorMessage(fieldName: string): string {
    const control = this.signUpForm.get(fieldName);
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
      if (control.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }
}
