import { Component } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'

import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatIcon } from '@angular/material/icon';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, MatIcon],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  constructor(public localStorageService: LocalStorageService, private loginService:LoginService) {}
}
