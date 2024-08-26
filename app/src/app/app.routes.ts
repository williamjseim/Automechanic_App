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
import { FrontpageComponent } from './components/frontpage/frontpage.component';
import { IssuetablepageComponent } from './components/issuetablepage/issuetablepage.component';
import { TablePrefabComponent } from './components/Prefabs/table-prefab/table-prefab.component';
import { FirstTimelogonComponent } from './components/first-timelogon/first-timelogon.component';
import { AnonymousPreviewComponent } from './components/anonymous-preview/anonymous-preview.component';

/**
 * Routes configuration for the Angular application.
 * 
 * This configuration defines the different routes and their corresponding components 
 * within the application. The routes are mapped to components that represent 
 * different pages or views.
 */

export const routes: Routes = [

  { path: '', component: FrontpageComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'login', component: LoginComponent },

  // Routes related to car issues
  {
    path: 'issue', component: CarIssueComponent,
    children: [
      { path: '', component: CreateCarIssueComponent },
      { path: 'submit', component: ReviewCarIssueComponent }
    ]
  },

  { path: 'issueprofile', component: CarIssueProfileComponent },
  { path: 'issuepreview', component: AnonymousPreviewComponent},
  { path: 'createcar', component: CreateCarFormComponent },
  { path: 'cars', component: CarPageComponent },
  { path: 'issues', component: IssuetablepageComponent },
  { path: 'carprofile', component: CarProfileComponent },
  { path: 'profile', component: UserprofilepageComponent },
  { path: 'test', component: TablePrefabComponent },
  { path: "firstlogon", component: FirstTimelogonComponent },
  { path: '**', component: ErrorComponent },
];
