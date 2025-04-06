import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

const GET_EMPLOYEES = gql`
  query {
    employees {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String,
    $last_name: String,
    $email: String,
    $gender: String,
    $designation: String,
    $salary: Float,
    $date_of_joining: String,
    $department: String
  ) {
    addEmployee(
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      gender: $gender,
      designation: $designation,
      salary: $salary,
      date_of_joining: $date_of_joining,
      department: $department
    ) {
      id
      first_name
      last_name
      email
    }
  }
`;

@Component({
  standalone: true,
  selector: 'app-add-employee',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(0)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: this.employeeForm.value,
        refetchQueries: [{ query: GET_EMPLOYEES }]
      }).subscribe({
        next: () => {
          this.successMessage = 'Employee added successfully!';
          setTimeout(() => {
            this.router.navigate(['/employees']);          
          }, 1000);
        },
        error: (error) => {
          console.error('Add employee error:', error);
          this.errorMessage = 'Failed to add employee. Please try again.';
        }
      });
    }
  }
}