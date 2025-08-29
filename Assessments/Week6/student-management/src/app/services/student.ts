import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student, Department } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students: Student[] = [];
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  departments: Department[] = [
    { label: 'Computer Science', value: 'CS' },
    { label: 'Information Technology', value: 'IT' },
    { label: 'Electronics', value: 'ECE' },
    { label: 'Mechanical', value: 'MECH' },
    { label: 'Civil', value: 'CIVIL' }
  ];

  addStudent(student: Omit<Student, 'id'>): void {
    const newStudent: Student = {
      ...student,
      id: Date.now()
    };
    this.students.push(newStudent);
    this.studentsSubject.next([...this.students]);
  }

  updateStudent(updatedStudent: Student): void {
    const index = this.students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      this.students[index] = updatedStudent;
      this.studentsSubject.next([...this.students]);
    }
  }

  getStudents(): Student[] {
    return [...this.students];
  }
}