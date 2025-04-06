import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const LOGIN_QUERY = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private apollo: Apollo, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.apollo.watchQuery({
        query: LOGIN_QUERY,
        variables: { email, password }
      }).valueChanges.subscribe({
        next: (result: any) => {
          const token = result.data.login.token;
          localStorage.setItem('token', token);
          this.successMessage = 'Login successful! Redirecting...';

          this.authService.setToken(token);

          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 2000);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid email or password';
        }
      });
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.apollo.query({
        query: LOGIN_QUERY,
        variables: { username, password },
        fetchPolicy: 'no-cache' // prevent caching issues
      }).subscribe({
        next: (result: any) => {
            const token = result.data.login.token;
            localStorage.setItem('token', token);
            console.log('Login successful:', result.data.login.user);

            this.successMessage = 'Login successful! Redirecting...';
            
            setTimeout(() => {
                this.router.navigate(['/employees']);
            }, 2500);
        },
        error: (error) => {
          console.error('Login failed:', error.message);
        }
      });
    }
  }
}