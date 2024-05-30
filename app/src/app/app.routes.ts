import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ErrorComponent } from './components/error/error.component';
import { CreateCarIssueComponent } from './components/carIssue/create-car-issue/create-car-issue.component';
import { CarIssueComponent } from './components/carIssue/car-issue/car-issue.component';
import { ReviewCarIssueComponent } from './components/carIssue/review-car-issue/review-car-issue.component';
import { CreateCarFormComponent } from './components/create-car-form/create-car-form.component';
import { CarPageComponent } from './components/car-page/car-page.component';
import { CarProfileComponent } from './components/car-profile/car-profile.component';
import { UserprofilepageComponent } from './components/userprofilepage/userprofilepage.component';
import { CarIssueProfileComponent } from './components/car-issue-profile/car-issue-profile.component';


export const routes: Routes = [

 { path: '', component: LoginComponent },
 { path: 'logout', component: LogoutComponent },
 { path: 'issue', component: CarIssueComponent, 
    children: [
      { path: '', component: CreateCarIssueComponent},
      { path: 'submit', component: ReviewCarIssueComponent}  
 ]},
 { path: 'issueprofile', component: CarIssueProfileComponent},
 { path: 'createcar', component: CreateCarFormComponent },
 { path: 'cars', component: CarPageComponent },
 { path: 'carprofile', component: CarProfileComponent},
 { path: 'profile', component: UserprofilepageComponent},
 { path: '**', component: ErrorComponent },
];
