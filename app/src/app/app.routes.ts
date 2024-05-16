import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { VideoCaptureComponent } from './components/video-capture/video-capture.component';
import { CarPageComponent } from './components/car-page/car-page.component';

export const routes: Routes = [

 { path: '', component: LoginComponent },
 { path: 'record', component: VideoCaptureComponent},
 { path: 'cars', component: CarPageComponent},
];
