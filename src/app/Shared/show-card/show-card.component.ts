import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Show } from 'src/app/Models/Show';

@Component({
  selector: 'show-card',
  templateUrl: './show-card.component.html',
  styleUrls: ['./show-card.component.scss']
})
export class ShowCardComponent implements OnInit {
  
  @Input() show!: Show
  @Output() cardClicked = new EventEmitter<Show>()

  constructor() { }

  ngOnInit(): void {
  }


  @HostListener('click', ['$event'])
  onClick(e: any){
    this.cardClicked.emit(this.show)
  }
}
