import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormRecord, UntypedFormControl, Validators } from '@angular/forms';
import { Scene } from 'src/app/Interfaces/Scene';
import { isEqual, merge } from "lodash"
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, first, map, pluck, Subject, takeUntil, tap } from 'rxjs';
import { ShowService } from 'src/app/Services/show.service';
import { Show } from 'src/app/Interfaces/Show';
import { SelectedSceneService } from './selected-scene.service';
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
  private $unSub = new Subject<any>()
  private readonly saveInterval = 1000 * 60 * 2 //2 minutes  


  show!: Show
  currScene?: Scene

  isSaved: boolean = true
  isAutoMode:boolean = false

  sceneForm = new FormGroup<SceneForm>({
    title: new FormControl<string>(''),
    script: new FormControl<string | null>(null),
    transistion: new FormControl<number | null>(null, Validators.pattern(/^[0-9]*$/)),

    position: new FormControl<GeoPosition>({lat: 0, long: 0, alt: 0, nodeName: SceneGraphNode.Earth }, {nonNullable: true}),
    options: new FormControl<SceneOptions>({keepCameraPosition: true, enabledTrails: []}, {nonNullable: true})
  })

  // private readonly autoSaveInterval = setInterval( () => this.saveShow(), this.saveInterval )


  constructor(private route: ActivatedRoute, public showService: ShowService,
     private selectedSceneService: SelectedSceneService, private openSpaceService: OpenspaceService,
     private notiService: NotificationService) {

    this.route.params
    .pipe(
      pluck('id'),
      map(id => showService.getShowById(parseInt(id))! ),
      tap(show => {
        //If at least on scene, set the id to highest id to avoid conflicting ids
        if(!show.scenes.length){ return }
        this.id = show.scenes.reduce((id, s) => Math.max(id, s.id), this.id)
      }),
      first()
    )
    .subscribe(show => this.show = show)
    
    this.initSelectedSceneService()

    this.sceneForm.valueChanges
    .pipe(
      takeUntil(this.$unSub),
      distinctUntilChanged( (a, b) => isEqual(a, b)),
      map(v =>{ 
        return {
          title: v.title,
          geoPos: v.position, sceneOptions: v.options,
          duration: v.transistion, script: v.script,
        } as Scene

      })
    )
    .subscribe(scene => {
      this.currScene = scene
      console.log(this.currScene)
    })
  }
  
  private initSelectedSceneService(): void{
    this.selectedSceneService.$selectedScene
    .pipe(
      takeUntil(this.$unSub),
      tap(() =>{
        //Set automode to false to not overwrite values
        if(this.scenePositionComponent)
          this.scenePositionComponent.$isAutoMode.next(false)
      })
    )
    .subscribe(s => {
      this.currScene = s

      this.sceneForm.setValue({
        title: s.title,
        position: s.geoPos,
        options: s.sceneOptions,
        script: s.script || null,
        transistion: s.duration || null
      })
    })
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { 
    this.$unSub.next(undefined) 
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

    try{
      //Set the current navigation state if option is selected
      if(this.currScene?.sceneOptions?.keepCameraPosition){
        this.currScene.navState = await this.openSpaceService.getNavigationState()
      }
      //Unset navstate if the keepcameraposition is unchecked but navstate is already set
      else if(!this.currScene?.sceneOptions?.keepCameraPosition && !!this.currScene?.navState){
        this.currScene.navState = undefined
      }
    }
    catch(err){ console.log('Error saving camera position') }
    finally{
     
      let existingScene = this.show.scenes.find(s => s.id === this.currScene!.id)
      
      if(!existingScene){
         this.show.scenes.push(this.currScene!) 
         return
      }
      
      merge(existingScene, this.currScene)    
      console.log(existingScene)
      console.log(this.show)
    }
  }

  onDelete(scene: Scene){
    //If the user is editing the scene and deletes it, reset current scene
    if(this.currScene!.id === scene.id){ this.setDefaultState() }

    this.show.scenes = this.show.scenes.filter(s => s.id !== scene.id)
  }

  newScene(): void{
    this.selectedSceneService.setScene(this.defaultScene)
    this.selectedSceneService.$newSceneAdded.next(undefined)
  }

  resetScene(): void{
    this.sceneForm.reset()
    this.isAutoMode = false
  }

  private get defaultScene(): Scene{
    this.id++
    
    return  { 
      id: this.id,
      title: '',
      geoPos: { lat: 0, long: 0, alt: 0, nodeName: SceneGraphNode.Earth },
      sceneOptions: {
        enabledTrails: [],
        keepCameraPosition: true
      }
    }
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

