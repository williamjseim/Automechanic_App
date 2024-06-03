import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { VideoCaptureComponent } from './components/video-capture/video-capture.component';
import { LoginComponent } from './components/login/login.component';
import { LocalStorageService } from './services/local-storage.service';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VideoCaptureComponent, LoginComponent, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(private localStorageService: LocalStorageService,private router: Router) { }

  title = 'Service app';

  ngOnInit(): void {
  //   const token = this.localStorageService.getFromLocalStorage("token");

  //   if (token) {
  //     this.router.navigateByUrl("record");
  //   }
  }
  
  timer?:ReturnType<typeof setTimeout>;
  ResetTimer(){
    if(this.timer != undefined){
      clearTimeout(this.timer);
      this.timer = setTimeout(this.Timeout, 10000);
    }
  }
  
  start(){
    console.log("start")
    this.timer = setTimeout(this.Timeout, 10000)
  }
  
  Timeout(){
    localStorage.removeItem("token");
    clearTimeout(this.timer);
    this.timer = undefined;
    this.router.navigateByUrl("/login")
  }


}
