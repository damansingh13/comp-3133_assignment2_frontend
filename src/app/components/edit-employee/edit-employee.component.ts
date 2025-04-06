import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
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

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!,
    $first_name: String,
    $last_name: String,
    $email: String,
    $gender: String,
    $designation: String,
    $salary: Float,
    $date_of_joining: String,
    $department: String
  ) {
    updateEmployee(
      id: $id,
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
    }
  }
`;

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: string | null = null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.apollo
        .watchQuery<any>({
          query: GET_EMPLOYEE,
          variables: { id: this.employeeId }
        })
        .valueChanges.subscribe({
          next: ({ data }) => {
            const emp = data.employee;
            this.employeeForm.patchValue(emp);
          },
          error: (error) => {
            console.error('Error loading employee:', error);
            this.errorMessage = 'Failed to load employee.';
          }
        });
    }
  }

  onSubmit() {
    if (this.employeeForm.valid && this.employeeId) {
      this.apollo.mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: {
          id: this.employeeId,
          ...this.employeeForm.value
        },
        refetchQueries: [{ query: GET_EMPLOYEES }]
      }).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          console.error('Update employee error:', error);
          this.errorMessage = 'Failed to update employee.';
        }
      });
    }
  }
}