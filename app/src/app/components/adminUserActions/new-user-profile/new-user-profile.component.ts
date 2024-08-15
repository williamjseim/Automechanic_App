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
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * NewUserProfileComponent:
 * 
 * This component provides a form for creating a new user profile. It includes fields for 
 * username, email, password, repeated password, and admin role selection. The component validates 
 * the input fields and manages the user creation process through a service. It also provides feedback 
 * to the user about the success or failure of the user creation process and handles loading states 
 * and error messages.
 */
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
    private snackbar: MatSnackBar
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
  }

  CreateUser() {

    
    let username = this.userForm.controls.username.value;
    let isAdminRole = this.userForm.controls.isAdminRole.value === true ? 1 : 0;
    
    
    //add html here
    this.loading = true;
    this.userHttp.createUser(username, "", "Kode1234!", isAdminRole).subscribe({
      next: (value) => {
        this.loading = false;
        this.snackbar.open(`Created user: ${username}`, 'Close', { duration: 4000 });
        this.dialogRef.close();
      },
      error: (err) => {
        this.errortext = err.error;
        this.loading = false;
      }
    });
  }
}
