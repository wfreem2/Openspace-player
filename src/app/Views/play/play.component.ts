import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs';
import { Scene } from 'src/app/Interfaces/Scene';
import { Show } from 'src/app/Interfaces/Show';
import { OpenspaceService } from 'src/app/Services/openspace.service';
import { ShowService } from 'src/app/Services/show.service';

@Component({
  selector: 'play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})

export class PlayComponent implements OnInit, AfterViewInit {
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
      console.log(show.scenes)
      this.scenes = show.scenes.map(s => { 
        return { scene: s, isActive: false}
      })
    })
   }

  ngAfterViewInit(): void { }

  ngOnInit(): void { }


  play(): void{
    if(this.scenes.length){
      this.setScene(this.scenes[0])
    }
  }


  setScene(playableScene: PlayableScene): void{

    if(this.currScene){
      this.currScene.isActive = false
    }

    playableScene.isActive = true
    this.currScene = playableScene

    this.currIdx = this.scenes.indexOf(playableScene)
    this.execute(this.currScene.scene)
  }

  private execute(scene: Scene): void{
    const {lat, long, alt, nodeName} = scene.geoPos
    
    this.openSpaceService.flyToGeo(lat, long, alt, nodeName)
  }

}

type PlayableScene = { scene: Scene, isActive: boolean}
