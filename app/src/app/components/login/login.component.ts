import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { LoginService } from '../../services/login.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';


/**
 * LoginComponent 
 * 
 * This component handles user login functionality.
 * It provides form controls for username and password,
 * validates the form inputs, and interacts with the LoginService
 * to authenticate the user. On successful login, user credentials
 * and tokens are stored in local storage, and the user is redirected
 * to the main page. Errors are handled and displayed as appropriate.
 */

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private router: Router ) {}

  error_text: string = "";

  // Form Controls
  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);

  // Form submit
  onSubmit(username: string, password: string) {
    if (this.usernameControl.invalid && this.passwordControl.invalid) {
      this.router.navigateByUrl("record");
    }
    if (this.usernameControl.valid || this.passwordControl.valid) {
      this.loginService.login(username, password).subscribe({
        next:(value)=>{
          this.localStorageService.addToLocalStorage("token", value.body);
          this.localStorageService.addToLocalStorage("isadmin", (value.headers as HttpHeaders).get("permission"));
          this.localStorageService.addToLocalStorage("refreshtoken", (value.headers as HttpHeaders).get("refreshtoken"));
          this.loginService.isUserSet().subscribe({
            next:(value)=>{
              if(value){
                this.router.navigateByUrl("");
              }
              else{
                this.router.navigateByUrl("firstlogon");
              }
            }
          })
        },
        error:(err) => {
          this.error_text = err.error;

        }
      });
  }}
}
