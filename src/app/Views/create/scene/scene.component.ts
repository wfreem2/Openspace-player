import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { of, Subscription, takeWhile } from 'rxjs';
import { Scene } from 'src/app/Interfaces/Scene';
import { OpenspaceService } from 'src/app/Services/openspace.service';

@Component({
  selector: 'scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit, OnDestroy, OnChanges {


  selectedSetting: selectedSetting = 'geo'
  
  @Input() scene!:Scene
  @Input() isAutoMode: boolean = true
  @Output() sceneSavedEvent = new EventEmitter<Scene>()

  
  private listener!: Subscription

  constructor(private openSpaceService: OpenspaceService) { }

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
    .pipe(takeWhile(_ => this.isAutoMode))
    .subscribe(pos => this.scene.geoPos = pos)
  }

  stopListening(){ this.listener.unsubscribe() }
}

type selectedSetting = 'geo' | 'script'