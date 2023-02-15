import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Show } from 'src/app/Models/Show';
import { ShowService } from 'src/app/Services/show.service';

@Component({
  selector: 'show-preview',
  templateUrl: './show-preview.component.html',
  styleUrls: ['./show-preview.component.scss']
})
export class ShowPreviewComponent implements OnInit {

  @Output() closeBtnClicked = new EventEmitter()
  @Input() show!: Show

  isConfirmShowing: boolean = false

  constructor(private showService: ShowService) {} 

  ngOnInit(): void { }

  showPrompt(): void{
    this.isConfirmShowing = true    
  }

  
  onConfirm(): void {
    this.showService.removeShowById(this.show.id)
    this.isConfirmShowing = false
    this.closeBtnClicked.emit()
  }

  onCancel(): void { this.isConfirmShowing = false }
}
