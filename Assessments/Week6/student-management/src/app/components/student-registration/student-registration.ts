import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './student-registration.html',
  styleUrl: './student-registration.css'
})
export class StudentRegistrationComponent {
  registrationForm: FormGroup;
  departments: any[] = [];
  isSubmitting = false;
  showSuccess = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {
    this.departments = this.studentService.departments;
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(45)]],
      department: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call delay
      setTimeout(() => {
        this.studentService.addStudent(this.registrationForm.value);
        this.isSubmitting = false;
        this.showSuccess = true;
        
        // Reset form and navigate after showing success
        setTimeout(() => {
          this.registrationForm.reset();
          this.showSuccess = false;
          this.router.navigate(['/students']);
        }, 2000);
      }, 1000);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['min']) return `Age must be at least ${field.errors['min'].min}`;
      if (field.errors['max']) return `Age must be at most ${field.errors['max'].max}`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}