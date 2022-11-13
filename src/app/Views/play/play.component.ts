import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, pluck, tap } from 'rxjs';
import { Scene } from 'src/app/Interfaces/Scene';
import { Show } from 'src/app/Interfaces/Show';
import { OpenspaceService, SceneGraphNode } from 'src/app/Services/openspace.service';
import { ShowService } from 'src/app/Services/show.service';

@Component({
  selector: 'play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})

export class PlayComponent implements OnInit {
  show!: Show
  currScene?: PlayableScene

  
  scenes!: PlayableScene[]
  currIdx?: number


  constructor(private route: ActivatedRoute, private showService: ShowService,
     private openSpaceService: OpenspaceService) {
    
    this.route.params
    .pipe(
      pluck('id'),
      map(id => parseInt(id)),
      map(id => showService.getShowById(id)),
    )
    .subscribe(show => {
      if(!show){ return } 
  
      this.show = show
      // console.log(show.scenes)
      
      this.scenes = show.scenes.map(s => { 
        return { scene: s, isActive: false}
      })
    })
   }

  ngOnInit(): void { }


  play(): void{
    if(this.scenes.length){ this.setScene(this.scenes[0]) }
  }


  setScene(playableScene: PlayableScene): void{

    if(this.currScene){ this.currScene.isActive = false }

    playableScene.isActive = true
    this.currScene = playableScene

    this.currIdx = this.scenes.indexOf(playableScene)
    this.execute(this.currScene.scene)
  }

  private execute(scene: Scene): void{
    // console.log(scene)
    
    const { navState, options, duration } = scene
    const { lat, long, alt, nodeName } = scene.geoPos

    this.openSpaceService.flyToGeo(lat, long, alt, nodeName, duration)

    if(options){
      const { enabledTrails, keepCameraPosition } = options
      
      if(keepCameraPosition && navState){ this.openSpaceService.setNavigationState(navState) }
      
      this.openSpaceService.disableAllNodeTrails()

      switch(enabledTrails.length){
        case Object.keys(SceneGraphNode).length: //All trails enabled
          this.openSpaceService.enableAllNodeTrails()
          break

        default: //Some trails enabled
          enabledTrails.forEach(trial => this.openSpaceService.setTrailVisibility(trial, true))
          break
      }

    }

  }



}

type PlayableScene = { scene: Scene, isActive: boolean}
