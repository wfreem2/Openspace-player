import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormRecord, UntypedFormControl, Validators } from '@angular/forms';
import { Scene } from 'src/app/Interfaces/Scene';
import { cloneDeep, isEqual, merge } from "lodash"
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, first, map, pairwise, pluck, startWith, Subject, takeUntil, tap } from 'rxjs';
import { ShowService } from 'src/app/Services/show.service';
import { Show } from 'src/app/Interfaces/Show';
import { SelectedSceneService as SelectedFormService } from './selected-scene.service';
import { OpenspaceService, SceneGraphNode } from 'src/app/Services/openspace.service';
import { ScenePositionComponent } from './scene-position/scene-position.component';
import { NotificationService } from 'src/app/Services/notification.service';
import { NotificationType } from 'src/app/Interfaces/ToastNotification';
import { SceneForm } from 'src/app/Interfaces/ShowForm';
import { GeoPosition } from 'src/app/Interfaces/GeoPosition';
import { SceneOptions } from 'src/app/Interfaces/SceneOptions';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit, OnDestroy {

  @ViewChild(ScenePositionComponent) scenePositionComponent!: ScenePositionComponent

  private id: number = 0
  private currId: number = 0

  private $unSub = new Subject<void>()
  private readonly saveInterval = 1000 * 60 * 2 //2 minutes  


  show!: Show
  currScene?: Scene

  isSaved: boolean = true
  isAutoMode:boolean = false

  currForm!: FormGroup<SceneForm>

  // private readonly autoSaveInterval = setInterval( () => this.saveShow(), this.saveInterval )
  sceneForm = this.fb.group<SceneForm>({
    script: this.fb.control<string | null>(null),
    transistion: this.fb.control<number | null>(null, Validators.pattern(/^[0-9]*$/)),
    
    title: this.fb.nonNullable.control<string>('New Scene', [Validators.required]),
    geoPos: this.fb.nonNullable.control<GeoPosition>({lat: 0, long: 0, alt: 0, nodeName: SceneGraphNode.Earth }),
    options: this.fb.nonNullable.control<SceneOptions>({keepCameraPosition: true, enabledTrails: []})
  })

  private readonly DEFAULT_SCENE = this.sceneForm.getRawValue()

  constructor(private route: ActivatedRoute, public showService: ShowService,
     public selectedFormService: SelectedFormService, private openSpaceService: OpenspaceService,
     private notiService: NotificationService, private fb: FormBuilder) {

    this.route.params
    .pipe(
      pluck('id'),
      map(id => showService.getShowById(parseInt(id))! ),
      tap(show => {
        //If at least on scene, set the id to highest id to avoid conflicting ids
        if(!show.scenes.length){ return }
        this.id = show.scenes.reduce((id, s) => Math.max(id, s.id), 0)
      }),
      first()
    )
    .subscribe(show => this.show = show)
    
    this.sceneForm.valueChanges
    .pipe(
      // distinctUntilChanged( (a, b) => isEqual(a, b))
    )
    .subscribe(v =>{
      console.log('valueChanges', v)
      merge(this.currScene, v)
    })

    this.selectedFormService.$selectedScene
    .pipe(
      takeUntil(this.$unSub),
      // tap(console.log),
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
    this.selectedFormService.setScene(newScene)
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { 
    this.$unSub.next()
    // clearInterval(this.autoSaveInterval)
  }

  onChange(): void{ this.isSaved = false }

  saveShow(): void{
    this.saveScene()
    this.showService.save(this.show) 

    this.isSaved=true
    this.notiService.showNotification({title: 'Show Saved', type: NotificationType.SUCCESS})
   
    if(this.scenePositionComponent){
      this.scenePositionComponent.$isAutoMode.next(false)
    }
  }

  async saveScene(): Promise<void>{

  }

  onDelete(scene: Scene){
    //If the user is editing the scene and deletes it, reset current scene
    if(this.currScene!.id === scene.id){ this.setDefaultState() }

    this.show.scenes = this.show.scenes.filter(s => s.id !== scene.id)
  }


  resetScene(): void{
    this.sceneForm.reset()
    this.isAutoMode = false
  }


  private setDefaultState(): void{
    this.currScene = undefined
    this.isAutoMode = false
  }

  get isSceneValid(): boolean{
    const { lat, long, alt, } = this.currScene!.geoPos
    return lat !== null && long !== null && alt !== null
  }

}

