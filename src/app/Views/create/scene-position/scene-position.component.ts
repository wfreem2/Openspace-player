import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scene } from 'src/app/Interfaces/Scene';
import { OpenspaceService, PathNavigationOptions } from 'src/app/Services/openspace.service';

@Component({
  selector: 'scene-position',
  templateUrl: './scene-position.component.html',
  styleUrls: ['./scene-position.component.scss']
})
export class ScenePositionComponent implements OnInit, OnDestroy, OnChanges {


  selectedSetting: selectedSetting = 'geo'
  
  @Input() scene!:Scene
  @Input() isAutoMode: boolean = true
  @Output() sceneSavedEvent = new EventEmitter<Scene>()

  pathNavOptions: PathNavigationOptions[] = []
  
  private listener!: Subscription

  constructor(private openSpaceService: OpenspaceService) { 
    this.pathNavOptions = Object.values(PathNavigationOptions)
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes['isAutoMode']){

      const { isAutoMode } = changes
      const { currentValue } = isAutoMode
      
      if(currentValue){ this.listenGeo() } 
      else{ this.stopListening() }
    }
  }

  ngOnDestroy(): void { this.stopListening() }

  ngOnInit(): void { }


  clear(): void{
    this.scene.geoPos = {
       alt: 0,
       lat: 0,
       long: 0
    }

    this.scene.title = ''
  }

  listenGeo(): void{
    this.listener = 
    this.openSpaceService
    .listenCurrentPosition()
    .subscribe({
      next: pos => this.scene.geoPos = pos,
      error:  _ => console.log('error with openspace')
    })
  }

  stopListening(){ 
    if(this.listener)
      this.listener.unsubscribe() 
  }
}

type selectedSetting = 'geo' | 'script'