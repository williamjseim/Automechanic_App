import { Component } from '@angular/core';
import { TablePrefabComponent } from '../../Prefabs/table-prefab/table-prefab.component';
import { LoginService } from '../../../services/login.service';
import { User } from '../../../Interfaces/user';
import { RouterLink } from '@angular/router';
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
  constructor(
    private userHttp: LoginService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.getUserPages();
  }

  getAllUsers() {
    this.userHttp.getAllUsers(this.currentPage, this.itemsPrPage).subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  JumpToPage(index: number) {
    if (index < 0) {
      index = 0;
    }
    this.currentPage = index;
    this.getAllUsers();
  }

  getUserPages() {
    this.userHttp.getUserPages(this.itemsPrPage).subscribe({
      next: (res) => {
        this.pages = res;
        if(this.currentPage >= this.pages) {
          this.currentPage = 0;
        }
      }
    });
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