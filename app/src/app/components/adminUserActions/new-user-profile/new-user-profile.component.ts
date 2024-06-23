import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogClose } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-new-user-profile',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatDialogClose, MatCheckboxModule, MatSelectModule, MatIconModule, MatButtonModule, MatInput, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule],
  templateUrl: './new-user-profile.component.html',
  styleUrl: './new-user-profile.component.scss'
})
export class NewUserProfileComponent {
  readonly dialogRef = inject(MatDialogRef<NewUserProfileComponent>);

  constructor(
    private userHttp: LoginService,
  ) {}

  errortext: string = "";
  loading: boolean = false;

  userForm = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    repeatedPassword: new FormControl(),
    isAdminRole: new FormControl()
  })

  ngOnInit() {
    this.userForm.controls.username.addValidators([Validators.required])
    this.userForm.controls.email.addValidators([Validators.required])
    this.userForm.controls.password.addValidators([Validators.required])
    this.userForm.controls.repeatedPassword.addValidators([Validators.required])
  }

  CreateUser() {

    
    let username = this.userForm.controls.username.value;
    let email = this.userForm.controls.email.value;
    let password = this.userForm.controls.password.value;
    let repeatedPassword = this.userForm.controls.repeatedPassword.value;
    let isAdminRole = this.userForm.controls.isAdminRole.value === true ? 1 : 0;
    
    
    //add html here
    if ((password == repeatedPassword) && this.userForm.valid) {
      this.loading = true;
      this.userHttp.createUser(username, email, password, isAdminRole).subscribe({
        next: (value) => {
          this.loading = false;
          this.dialogRef.close();
        },
        error: (err) => {
          this.errortext = err.error;
          this.loading = false;
        }
      });
    }
    else {

    }
  }
}
