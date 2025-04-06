import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';

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
      employee_photo
    }
  }
`;

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit {
  employee: any = null;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private apollo: Apollo) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.apollo
        .watchQuery<any>({
          query: GET_EMPLOYEE,
          variables: { id }
        })
        .valueChanges.subscribe({
          next: ({ data }) => {
            this.employee = data.employee;
          },
          error: (error) => {
            console.error('Error loading employee:', error);
            this.errorMessage = 'Employee not found.';
          }
        });
    }
  }
}