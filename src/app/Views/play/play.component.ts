import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, first, map, pluck, tap } from 'rxjs';
import { Scene } from 'src/app/Interfaces/Scene';
import { Show } from 'src/app/Interfaces/Show';
import { NotificationType } from 'src/app/Interfaces/ToastNotification';
import { NotificationService } from 'src/app/Services/notification.service';
import { OpenspaceService, SceneGraphNode } from 'src/app/Services/openspace.service';
import { SceneExecutorService } from 'src/app/Services/scene-executor.service';
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
     private openSpaceService: OpenspaceService, private notiService: NotificationService,
     private sceneExecutor: SceneExecutorService) {
    
    this.route.params
    .pipe(
      pluck('id'),
      map(id => parseInt(id)),
      map(id => showService.getShowById(id)!),
    )
    .subscribe(show => {
      this.show = show
      
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

    if(playableScene === this.currScene){ return }

    if(this.currScene){ this.currScene.isActive = false }

    playableScene.isActive = true
    this.currScene = playableScene

    this.currIdx = this.scenes.indexOf(playableScene)
    this.execute(this.currScene.scene)
  }

  private execute(scene: Scene): void{
  
    try{
      this.sceneExecutor.execute(scene)
    }
    catch(_){
      this.openSpaceService.isConnected()
      .pipe(
        filter(status => !status),
        first()
      )
      .subscribe( () => {
        this.notiService.showNotification({
          title: 'Failed to play scene. Openspace is not connected.',
          type: NotificationType.ERROR
        })
      })
    }
  }



}

type PlayableScene = { scene: Scene, isActive: boolean}
