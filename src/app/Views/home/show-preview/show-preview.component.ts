import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Show } from 'src/app/Interfaces/Show';

@Component({
  selector: 'show-preview',
  templateUrl: './show-preview.component.html',
  styleUrls: ['./show-preview.component.scss']
})
export class ShowPreviewComponent implements OnInit {

  @Output() closeBtnClicked = new EventEmitter()
  @Input() show!: Show
  constructor() {} 

  ngOnInit(): void { }



}
