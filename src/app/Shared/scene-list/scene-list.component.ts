import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ScaleInOut } from 'src/app/Animations/animations';
import { Scene } from 'src/app/Interfaces/Scene';

@Component({
  selector: 'scene-list',
  templateUrl: './scene-list.component.html',
  styleUrls: ['./scene-list.component.scss'],
  animations: [ScaleInOut]
})
export class SceneListComponent implements OnInit {


  @Input() scenes: Scene[] = []

  @Input() isReadOnly:boolean = false

  @Output() editSceneClicked = new EventEmitter<Scene>()
  @Output() deleteSceneClicked = new EventEmitter<Scene>()

  constructor() { }

  ngOnInit(): void { }
}
