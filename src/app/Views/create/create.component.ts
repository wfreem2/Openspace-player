import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Scene } from 'src/app/Interfaces/Scene';
import { cloneDeep, isEqual, merge } from "lodash";
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, first, map, Observable, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';
import { ShowService } from 'src/app/Services/show.service';
import { Show } from 'src/app/Interfaces/Show';
import { OpenspaceService, SceneGraphNode } from 'src/app/Services/openspace.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { NotificationType } from 'src/app/Interfaces/ToastNotification';
import { SceneForm } from 'src/app/Interfaces/ShowForm';
import { GeoPosition } from 'src/app/Interfaces/GeoPosition';
import { SceneOptions } from 'src/app/Interfaces/SceneOptions';
import { SceneExecutorService } from 'src/app/Services/scene-executor.service';
import { CreatorMenuItem } from 'src/app/Interfaces/CreatorMenuItem';
import { CreateService } from './services/create.service';
import { ScenePositionComponent } from './components/scene-position/scene-position.component';
import { SelectedSceneService } from './services/selected-scene.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit, OnDestroy {

  @ViewChild(ScenePositionComponent) scenePositionComponent!: ScenePositionComponent


  // #region observable sources
    readonly $setScene = new BehaviorSubject<Scene | null>(null)
    readonly $setSaveDisabled = new BehaviorSubject<boolean>(false)
    readonly $setConfirmVisibility = new Subject<boolean>()

    private $unSub = new Subject<void>()
  // #endregion

  // #region observable subscribers
    readonly $selectedScene = this.$setScene
    .asObservable()
    .pipe(
      tap( s => {
        if(s == null){ return }

        this.sceneForm.setValue(
          {
            title: s.title,
            geoPos: s.geoPos,
            options: s.options,
            script: s.script || '',
            transistion: s.duration || null
          }, 
          { emitEvent: false }
        )
      })  
    )
    
    readonly $isConfirmShowing = this.$setConfirmVisibility.asObservable()
    readonly $isSaveDisabled = this.$setSaveDisabled.asObservable()
  // #endregion

  onConfirmFn = () => {}
  confirmPrompt = ''

  show!: Show
  query: string = ''

  isSaved: boolean = true
  isAutoMode:boolean = false


  sceneForm = this.fb.group<SceneForm>({
    script: this.fb.control<string | null>(null),
    transistion: this.fb.control<number | null>(null, Validators.pattern(/^[0-9]*.[0-9]*$/)),
    
    title: this.fb.nonNullable.control<string>('New Scene', [Validators.required]),
    geoPos: this.fb.nonNullable.control<GeoPosition>({lat: 0, long: 0, alt: 0, nodeName: SceneGraphNode.Earth }),
    options: this.fb.nonNullable.control<SceneOptions>({keepCameraPosition: true, enabledTrails: []})
  })
  
  menu!: CreatorMenuItem[]


  
  readonly DEFAULT_SCENE = this.sceneForm.getRawValue()

  constructor(private route: ActivatedRoute, public showService: ShowService, public createService: CreateService,
     public selectedSceneService: SelectedSceneService, private notiService: NotificationService,
     private fb: FormBuilder, private openSpaceService: OpenspaceService, 
     private sceneExecutor: SceneExecutorService) {

    this.route.params
    .pipe(
      map(params => params?.['id']),
      map(id => showService.getShowById(parseInt(id))! ),
      first()
    )
    .subscribe(show => this.show = show)
    
    
    this.sceneForm.valueChanges
    .pipe(
      takeUntil(this.$unSub),
      withLatestFrom(this.$selectedScene),
      // distinctUntilChanged( (a, b) => isEqual(a, b)),
      map( ([formVal, selectedScene]) => {
        return [
          {
            id: selectedScene!.id,
            title: formVal.title!,
            geoPos: formVal.geoPos!,
            options: formVal.options!,
            duration: formVal.transistion!,
            script: formVal.script!
          },
          selectedScene
        ]
      }),
      tap( () => {
        this.isSaved = false
        this.$setSaveDisabled.next(!this.sceneForm.valid)

        console.log('form changed')
      })
    )
    .subscribe( ([updated, original]) => merge(original, updated) )
  }



  ngOnInit(): void { 
    this.menu = [
      {
        name: 'File',
        subMenus: [
          {
            name: 'Save',
            hotKey: ['S'],
            callBack: this.saveShow.bind(this),
            isDisabled: this.$isSaveDisabled
          },
          {
            name: 'Export',
            hotKey: ['E'],
            callBack: this.saveToDisk.bind(this),
            isDisabled: this.$isSaveDisabled
          },
          {
            name: 'Duplicate Show',
            hotKey: ['SHIFT', 'D'],
            callBack: () => {},
            isDisabled: false
          }
        ]
      },
    ]
  }

  ngOnDestroy(): void { this.$unSub.next() }


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

  onCancel(): void{ this.createService.setIsConfirmShowing(false) }

  onDeleteClicked(){ 
    this.confirmPrompt = 'Delete the selected scene?'
    this.$setConfirmVisibility.next(true)
    this.onConfirmFn = this.deleteScene.bind(this)
  }

  onResetClicked(): void{
    this.confirmPrompt = 'Reset the selected scene?'
    this.$setConfirmVisibility.next(true)
    this.onConfirmFn = this.resetScene.bind(this)
  }

  onDuplicateClicked(scenes: Scene){
    this.show.scenes.push(scenes)
  }

  deleteScene(): void{
    const scene = this.$setScene.getValue()
    
    this.show.scenes = this.show.scenes.filter(s => s.id !== scene!.id)
    
    this.notiService.showNotification({
      title: `Scene: ${scene!.title} deleted`,
      type: NotificationType.SUCCESS
    })

    this.$setConfirmVisibility.next(false)
    this.$setScene.next(null)
    this.isSaved = false
  }

  resetScene(): void{
    this.sceneForm.reset()
    this.isAutoMode = false
    this.$setConfirmVisibility.next(false)
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

  saveToDisk(): void{
    const a = document.createElement('a')
    const showString = JSON.stringify(this.show)
    const file = new Blob([showString], {type: 'application/json'})
    const fileTitle = this.show.title + '.json'

    a.href = URL.createObjectURL(file)
    a.download = fileTitle
    a.click()

    URL.revokeObjectURL(a.href)

    this.notiService.showNotification({
      title: 'Show saved to ' + fileTitle,
      type: NotificationType.SUCCESS
    })

  }
}

