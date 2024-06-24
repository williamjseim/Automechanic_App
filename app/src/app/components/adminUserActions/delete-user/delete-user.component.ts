import { Component } from '@angular/core';
import { TablePrefabComponent } from '../../Prefabs/table-prefab/table-prefab.component';
import { LoginService } from '../../../services/login.service';
import { User } from '../../../Interfaces/user';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [RouterLink, TablePrefabComponent],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss'
})
export class DeleteUserComponent {
  users?: User[]
  pages: number = 0;
  currentPage: number = 0;
  itemsPrPage: number = 5;

  searchForm = new FormGroup({
    username: new FormControl(),
  });
  
  constructor(
    private userHttp: LoginService
  ) {}

  ngOnInit(): void {
    this.getUserPages();
    this.RemoveFilters();
  }

  getAllUsers(username: string = "") {
    this.userHttp.getAllUsers(this.currentPage, this.itemsPrPage, username).subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  //gets filtered cars from server
  Search(skipGetPages: boolean = false) {
    let username = this.searchForm.controls.username.value;

    this.getAllUsers(username);
    if (!skipGetPages)
      this.getUserPages(username);
  }

  JumpToPage(index: number) {
    if (index < 0) {
      index = 0;
    }
    this.currentPage = index;
    this.getAllUsers();
  }
  RemoveFilters() {
    this.searchForm.controls.username.reset("");
    this.Search();
  }

  getUserPages(username: string = "") {
    this.userHttp.getUserPages(this.itemsPrPage, username).subscribe({
      next: (res) => {
        this.pages = res;
        if(this.currentPage >= this.pages) {
          this.currentPage = 0;
        }
      }
    });
  }
  ChangeNumberPrPage(number: number) {
    this.itemsPrPage = number;
    this.currentPage = 0;
    this.getUserPages();
    this.Search();
  }
  deleteUser(index: number) {
    let user = this.users![index];
    this.userHttp.deleteUser(user.id).subscribe({
      next: (res) => {
        this.users?.splice(index, 1)
      }
    })
  }

  
}