import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-timelogon',
  standalone: true,
  imports: [],
  templateUrl: './first-timelogon.component.html',
  styleUrl: './first-timelogon.component.scss'
})
export class FirstTimelogonComponent {
  
  constructor( private userHttp: LoginService, private snackbar: MatSnackBar, private router:Router) {}

  ngOnInit(){
  }

  

  SubmitUserInfo(fullname:string, email:string, password:string, verifyPassword:string){
    console.log(fullname, email, password, verifyPassword)
    this.userHttp.SetupUser(email, password, fullname).subscribe({
      next:(value)=>{
        this.router.navigate([""]);
      },
      error:(err)=>{

      }
    })
  }
}
