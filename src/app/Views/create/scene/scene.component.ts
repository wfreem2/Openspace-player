import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeWhile } from 'rxjs';
import { Scene } from 'src/app/Interfaces/Scene';
import { OpenspaceService } from 'src/app/Services/openspace.service';

@Component({
  selector: 'scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {


  selectedSetting: selectedSetting = 'geo'
  
  @Input() scene!:Scene
  @Input() isAutoMode: boolean = true
  @Output() sceneSavedEvent = new EventEmitter<Scene>()

  constructor(private openSpaceService: OpenspaceService) { }

  ngOnInit(): void { 
    if(this.isAutoMode){ this.listenGeo() }
  }

  clear(): void{
    this.scene.geoPos = {
       alt: 0,
       lat: 0,
       long: 0
    }

    this.scene.title = ''
  }

  listenGeo(): void{
    this.openSpaceService.
    listenCurrentPosition()
    .pipe(takeWhile(_ => this.isAutoMode))
    .subscribe(pos => this.scene.geoPos = pos)
  }
}

type selectedSetting = 'geo' | 'script'