import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'show-preview',
  templateUrl: './show-preview.component.html',
  styleUrls: ['./show-preview.component.scss']
})
export class ShowPreviewComponent implements OnInit {

  @Output() closeBtnClicked = new EventEmitter()

  constructor() { }

  ngOnInit(): void { }



}
