import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreatorMenuItem } from 'src/app/Interfaces/CreatorMenuItem';
import { Show } from 'src/app/Interfaces/Show';

@Component({
  selector: 'creator-header',
  templateUrl: './creator-header.component.html',
  styleUrls: ['./creator-header.component.scss']
})
export class CreatorHeaderComponent implements OnInit {

  @Output() titleChange = new EventEmitter<string>()
  @Input() show!: Show
  @Input() menu!: CreatorMenuItem[]
  
  constructor() { }

  ngOnInit(): void {
  }
  
}
