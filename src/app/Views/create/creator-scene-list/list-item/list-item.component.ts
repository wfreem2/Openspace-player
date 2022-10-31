import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scene } from 'src/app/Interfaces/Scene';

@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

  @Input() isActive: boolean = false
  @Input() scene!: Scene

  @Output() itemClickedEvent = new EventEmitter<ListItemComponent>()
  
  constructor() { } 

  ngOnInit(): void { }

}
