import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { VideoCaptureComponent } from './components/video-capture/video-capture.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ErrorComponent } from './components/error/error.component';
import { CreateCarFormComponent } from './components/create-car-form/create-car-form.component';
import { CarPageComponent } from './components/car-page/car-page.component';

export const routes: Routes = [

 { path: '', component: LoginComponent },
 { path: 'record', component: VideoCaptureComponent},
 { path: 'logout', component: LogoutComponent },
 { path: 'createcar', component: CreateCarFormComponent },
 { path: 'cars', component: CarPageComponent },
 { path: '**', component: ErrorComponent },
];
