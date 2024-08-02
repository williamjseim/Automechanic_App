import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../services/login.service";

/**
 * LogoutComponent
 * 
 * This component is used for routing properties.
 * When routed to, init method will log the user out of the system
 */
@Component({
    template: ''
})

export class LogoutComponent implements OnInit {

    constructor(private _authService: LoginService, private router: Router) { }

    ngOnInit() {
        this._authService.logout();
        this.router.navigate(['']);
    }

}