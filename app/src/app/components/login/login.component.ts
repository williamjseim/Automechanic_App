import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private loginService: AuthService,
    private router: Router ) {}

  // Form Controls
  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);


  // Form submit
  onSubmit(username: string, password: string) {
    if (this.usernameControl.invalid && this.passwordControl.invalid) {
      this.router.navigateByUrl("record");
    }
    if (this.usernameControl.valid || this.passwordControl.valid) {
      const loginData = { username, password };
      
      this.loginService.login(loginData)
      .subscribe(r => {
        console.log(`Login successful: ${r}`);
        this.router.navigateByUrl("record");
      });
      }
  }
}
