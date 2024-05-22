import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../services/login.service";
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