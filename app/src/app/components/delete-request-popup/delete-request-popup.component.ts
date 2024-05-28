import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-request-popup',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, NgClass],
  templateUrl: './delete-request-popup.component.html',
  styleUrl: './delete-request-popup.component.scss'
})
export class DeleteRequestPopupComponent {
  DeleteText = "Delete"
  tableIndex = -1;
  deleteError = "Wrong input";
  wrong = false;
  IsHidden = true;

  //Outputs a event with a string then correct input text
  @Output("Complete") Complete:EventEmitter<any> = new EventEmitter();
  
  @Output("Error") Error:EventEmitter<any> = new EventEmitter();

  RemoveCar(text:string){
    if(text == this.DeleteText){
      this.Complete!.emit(this.tableIndex);
      this.IsHidden = true;
      this.tableIndex = -1;
      this.wrong = false;
    }
    else{
      this.wrong = true;
    }
  }

  Open(index:number){
    this.IsHidden = false;
    this.tableIndex = index;
  }

  Cancel(){
    this.IsHidden = true;
    this.tableIndex = -1;
  }
}
