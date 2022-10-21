import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scene } from 'src/app/Interfaces/Scene';
import { OpenspaceService } from 'src/app/Services/openspace.service';

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

  constructor(private openSpaceService: OpenspaceService) { }

  ngOnInit(): void { }

  clear(): void{
    this.scene.geoPos = {
       alt: 0,
       lat: 0,
       long: 0
    }

    this.scene.title = ''
  }


  async setGeo(){
    const pos = await this.openSpaceService.getCurrentPosition()
    this.scene.geoPos = {...pos}
    
    console.log(pos)
  }
}

type selectedSetting = 'geo' | 'script'