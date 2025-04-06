import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id
      first_name
    }
  }
`;

const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($designation: String, $department: String) {
    searchEmployees(designation: $designation, department: $department) {
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

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  searchCriteria = {
    designation: '',
    department: ''
  };

  constructor(
    private apollo: Apollo, 
    private authService: AuthService, 
    private router: Router
) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.apollo.watchQuery<any>({
        query: GET_EMPLOYEES,
        fetchPolicy: 'network-only'
      }).valueChanges.subscribe(({ data }) => {
        this.employees = data.employees;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deleteEmployee(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this employee?');
  
    if (confirmDelete) {
      this.apollo.mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { id },
        refetchQueries: [{ query: GET_EMPLOYEES }]
      }).subscribe({
        next: () => {
          console.log('Employee deleted.');
        },
        error: (error) => {
          console.error('Delete failed:', error);
        }
      });
    }
  }

  searchEmployees() {
    this.apollo.watchQuery<any>({
      query: SEARCH_EMPLOYEES,
      variables: {
        designation: this.searchCriteria.designation || null,
        department: this.searchCriteria.department || null
      },
      fetchPolicy: 'network-only'
    }).valueChanges.subscribe(({ data }) => {
      this.employees = data.searchEmployees;
    });
  }
  
  resetSearch() {
    this.searchCriteria = { designation: '', department: '' };
    this.loadEmployees();
  }
  
}