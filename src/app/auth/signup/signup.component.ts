import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';
import { RouterModule, Router } from '@angular/router';

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  successMessage = '';

  constructor(private fb: FormBuilder, private apollo: Apollo, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form is valid, submitting...');
      const { username, email, password } = this.signupForm.value;
  
      this.apollo.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password }
      }).subscribe({
        next: (result: any) => {
            const token = result.data.signup.token;
            localStorage.setItem('token', token);
            console.log('Signup successful:', result.data.signup.user);

            this.successMessage = 'Signup successful! Redirecting...';

            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 2500);
        },
        error: (error) => {
          console.error('Signup failed:', error.message);
        }
      });
    }else {
      console.log('Form is invalid');
    }
  }
  
}