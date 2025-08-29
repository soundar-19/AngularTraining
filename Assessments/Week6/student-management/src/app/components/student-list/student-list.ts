import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../services/student';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  displayDialog = false;
  selectedStudent: Student | null = null;
  editForm: FormGroup;
  departments: any[] = [];

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder
  ) {
    this.departments = this.studentService.departments;
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(45)]],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.studentService.students$.subscribe(students => {
      this.students = students;
    });
  }

  onRowSelect(student: Student): void {
    this.selectedStudent = student;
    this.editForm.patchValue(student);
    this.displayDialog = true;
  }

  onSave(): void {
    if (this.editForm.valid && this.selectedStudent) {
      const updatedStudent: Student = {
        ...this.selectedStudent,
        ...this.editForm.value
      };
      this.studentService.updateStudent(updatedStudent);
      this.displayDialog = false;
    }
  }

  onCancel(): void {
    this.displayDialog = false;
    this.selectedStudent = null;
    this.editForm.reset();
  }

  getFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
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
    const field = this.editForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  getDepartmentLabel(value: string): string {
    const dept = this.departments.find(d => d.value === value);
    return dept ? dept.label : value;
  }
}