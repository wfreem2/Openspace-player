import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scene } from 'src/app/Interfaces/Scene';

@Component({
  selector: 'scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {


  isAutoMode: boolean = true
  selectedSetting: selectedSetting = 'geo'
  
  @Input() scene!:Scene
  @Output() sceneSavedEvent = new EventEmitter<Scene>()

  constructor() { }

  ngOnInit(): void { }

  clear(): void{
    this.scene.geoPos = {
       alt: 0,
       lat: 0,
       long: 0
    }

    this.scene.title = ''
  }

}

type selectedSetting = 'geo' | 'script'