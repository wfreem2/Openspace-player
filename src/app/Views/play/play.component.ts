import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs';
import { Scene } from 'src/app/Interfaces/Scene';
import { Show } from 'src/app/Interfaces/Show';
import { ShowService } from 'src/app/Services/show.service';
import { toggleClass } from 'src/app/Utils/utils';

@Component({
  selector: 'play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})

export class PlayComponent implements OnInit, AfterViewInit {
  show!: Show
  currScene?: Scene

  scenes!: PlayableScene[]

  currIdx?: number

  constructor(private route: ActivatedRoute, private showService: ShowService) {

    this.route.params
    .pipe(
      pluck('id'),
      map(id => parseInt(id)),
      map(id => showService.getShowById(id)),
    )
    .subscribe(show => {
      if(!show){ return } 
  
      this.show = show

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
    this.scenes.forEach((scene) => {
      if(scene.isActive)
        scene.isActive = false
    })

    playableScene.isActive = true
    this.currScene = playableScene.scene

    this.currIdx = this.scenes.indexOf(playableScene)
  }
}

type PlayableScene = { scene: Scene, isActive: boolean}
