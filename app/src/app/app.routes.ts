import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { VideoCaptureComponent } from './components/video-capture/video-capture.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ErrorComponent } from './components/error/error.component';

export const routes: Routes = [

 { path: '', component: LoginComponent },
 { path: 'record', component: VideoCaptureComponent},
 { path: 'logout', component: LogoutComponent},
 { path: '**', component: ErrorComponent}
];
