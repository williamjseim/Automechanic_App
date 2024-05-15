import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { VideoCaptureComponent } from './components/video-capture/video-capture.component';
import { LoginComponent } from './components/login/login.component';
import { LocalStorageService } from './services/local-storage.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VideoCaptureComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router) { }

  title = 'app';

  ngOnInit(): void {
  //   const token = this.localStorageService.getFromLocalStorage("token");

  //   if (token) {
  //     this.router.navigateByUrl("record");
  //   }
  }
}
