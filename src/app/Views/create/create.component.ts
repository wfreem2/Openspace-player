import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormRecord, UntypedFormControl, Validators } from '@angular/forms';
import { Scene } from 'src/app/Interfaces/Scene';
import { cloneDeep, isEqual, merge } from "lodash"
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter, first, map, pairwise, pluck, startWith, Subject, takeUntil, tap } from 'rxjs';
import { ShowService } from 'src/app/Services/show.service';
import { Show } from 'src/app/Interfaces/Show';
import { SelectedSceneService as SelectedSceneService } from './selected-scene.service';
import { OpenspaceService, SceneGraphNode } from 'src/app/Services/openspace.service';
import { ScenePositionComponent } from './scene-position/scene-position.component';
import { NotificationService } from 'src/app/Services/notification.service';
import { NotificationType } from 'src/app/Interfaces/ToastNotification';
import { SceneForm } from 'src/app/Interfaces/ShowForm';
import { GeoPosition } from 'src/app/Interfaces/GeoPosition';
import { SceneOptions } from 'src/app/Interfaces/SceneOptions';
import { SceneExecutorService } from 'src/app/Services/scene-executor.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit, OnDestroy {

  @ViewChild(ScenePositionComponent) scenePositionComponent!: ScenePositionComponent


  private $unSub = new Subject<void>()
  
  onConfirmFn = () => {}
  confirmPrompt = ''

  show!: Show
  currScene?: Scene
  query: string = ''

  isSaved: boolean = true
  isAutoMode:boolean = false
  isConfirmShowing: boolean = false

  sceneForm = this.fb.group<SceneForm>({
    script: this.fb.control<string | null>(null),
    transistion: this.fb.control<number | null>(null, Validators.pattern(/^[0-9]*.[0-9]*$/)),
    
    title: this.fb.nonNullable.control<string>('New Scene', [Validators.required]),
    geoPos: this.fb.nonNullable.control<GeoPosition>({lat: 0, long: 0, alt: 0, nodeName: SceneGraphNode.Earth }),
    options: this.fb.nonNullable.control<SceneOptions>({keepCameraPosition: true, enabledTrails: []})
  })
  

  private readonly DEFAULT_SCENE = this.sceneForm.getRawValue()

  constructor(private route: ActivatedRoute, public showService: ShowService,
     public selectedSceneService: SelectedSceneService,private notiService: NotificationService,
     private fb: FormBuilder, private openSpaceService: OpenspaceService, 
     private sceneExecutor: SceneExecutorService) {

    this.route.params
    .pipe(
      pluck('id'),
      map(id => showService.getShowById(parseInt(id))! ),
      first()
    )
    .subscribe(show => this.show = show)
    
    this.sceneForm.valueChanges
    .pipe(
      distinctUntilChanged( (a, b) => isEqual(a, b)),
      map(v => {
        return {
          title: v.title,
          geoPos: v.geoPos,
          options: v.options,
          duration: v.transistion,
          script: v.script
        }
      }),
      tap( () => this.isSaved = false)
    )
    .subscribe( v => merge(this.currScene, v) )  

    this.selectedSceneService.$selectedScene
    .pipe(
      takeUntil(this.$unSub),
      filter(s => !!s)
    )
    .subscribe( (s: Scene) => {
      const existing = this.show.scenes.find(scene => scene.id === this.currScene?.id)

      if(existing){ 
        const rawScene = this.sceneForm.getRawValue()

        const newScene = {
          title: rawScene.title,
          geoPos: rawScene.geoPos,
          options: rawScene.options,
          duration: rawScene.transistion || undefined,
          script: rawScene.script || undefined
        }

        merge(existing, newScene) 
      }

      this.currScene = s

      this.sceneForm.setValue({
        title: s.title,
        geoPos: s.geoPos,
        options: s.options,
        script: s.script || '',
        transistion: s.duration || null
      }, 
      {emitEvent: false})
    })
  }

  newScene(): void{
    const id = this.show.scenes.reduce((a, b) => Math.max(a, b.id), 0) + 1
    const rawScene = cloneDeep(this.DEFAULT_SCENE)

    const newScene: Scene = {
      id: id,
      title: rawScene.title,
      geoPos: rawScene.geoPos,
      options: rawScene.options,
      duration: rawScene.transistion || undefined,
      script: rawScene.script || undefined
    }

    this.show.scenes.push(newScene)
    this.selectedSceneService.setScene(newScene)
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { 
    this.$unSub.next()
  }

  onChange(): void{ this.isSaved = false }

  saveShow(): void{

    if(!this.sceneForm.valid){ return }
    
    this.showService.save(this.show) 
    this.isSaved=true
    this.notiService.showNotification({title: 'Show Saved', type: NotificationType.SUCCESS})
   
    if(this.scenePositionComponent){
      this.scenePositionComponent.$isAutoMode.next(false)
    }
  }

  onCancel(): void{ this.isConfirmShowing = false }

  onDeleteClicked(){ 
    this.confirmPrompt = 'Delete the selected scene?'
    this.isConfirmShowing = true 
    this.onConfirmFn = this.deleteScene.bind(this)
  }

  onResetClicked(): void{
    this.confirmPrompt = 'Reset the selected scene?'
    this.isConfirmShowing = true
    this.onConfirmFn = this.resetScene.bind(this)
  }

  onDuplicateClicked(scenes: Scene){
    this.show.scenes.push(scenes)
  }

  deleteScene(): void{
    this.show.scenes = this.show.scenes.filter(s => s.id !== this.currScene!.id)
    
    this.notiService.showNotification({
      title: `Scene: ${this.currScene?.title} deleted`,
      type: NotificationType.SUCCESS
    })

    this.currScene = undefined
    this.isConfirmShowing = false
    this.isSaved = false
  }

  resetScene(): void{
    this.sceneForm.reset()
    this.isAutoMode = false
    this.isConfirmShowing = false
  }


  preview(scene: Scene): void{
  
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

