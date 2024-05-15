import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { VideoCaptureComponent } from './components/video-capture/video-capture.component';
import { LoginComponent } from './components/login/login.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VideoCaptureComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';
}
