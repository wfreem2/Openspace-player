import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scene } from 'src/app/Interfaces/Scene';

@Component({
  selector: 'scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {


  selectedSetting: selectedSetting = 'geo'
  @Input() scene!:Scene
  @Output() sceneSavedEvent = new EventEmitter<Scene>()

  constructor() { }

  ngOnInit(): void { }

}

type selectedSetting = 'geo' | 'settings'