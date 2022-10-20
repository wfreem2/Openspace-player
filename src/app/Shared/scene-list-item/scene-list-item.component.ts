import { Component, Input, OnInit } from '@angular/core';
import { Scene } from 'src/app/Interfaces/Scene';

@Component({
  selector: 'scene-list-item',
  templateUrl: './scene-list-item.component.html',
  styleUrls: ['./scene-list-item.component.scss']
})
export class SceneListItemComponent implements OnInit {

  isCollapsed:boolean = false
  isSelected:boolean = true
  @Input() scene!: Scene

  constructor() { } 

  ngOnInit(): void {
  }

}
