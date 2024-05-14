import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private mockUser = { username: "1", password: "1" }

  onSubmit(username: string, password: string) {
    const loginData = { username, password };
    console.log("Form submitted");
    if (loginData == this.mockUser) {
      console.log("Login successful");
    }
    else {
      console.log("login failed");
    }
    // this.http.post<any>('YOUR_API_ENDPOINT', loginData).subscribe(
    //   response => {
    //     // Handle successful login response
    //     console.log('Login successful:', response);
    //   },
    //   error => {
    //     // Handle error
    //     console.error('Login error:', error);
    //   }
    // );
  }
}
