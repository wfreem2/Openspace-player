import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Show } from 'src/app/Interfaces/Show';
import { ShowService } from 'src/app/Services/show.service';

@Component({
  selector: 'show-preview',
  templateUrl: './show-preview.component.html',
  styleUrls: ['./show-preview.component.scss']
})
export class ShowPreviewComponent implements OnInit {

  @Output() closeBtnClicked = new EventEmitter()
  @Input() show!: Show

  constructor(private showService: ShowService) {} 

  ngOnInit(): void { }


  delete(): void{
    this.showService.removeShowById(this.show.id)
    this.closeBtnClicked.emit()
  }


}
