import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.scss'
})
export class FrontpageComponent {
  constructor(private router:Router){}

  ngOnInit(){
    if(localStorage["token"] == null){
      this.router.navigate(["login"])
    }
  }
}
