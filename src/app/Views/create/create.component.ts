import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Scene } from 'src/app/Models/Scene';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, concatMap, distinctUntilChanged, filter, first, map, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';
import { ShowService } from 'src/app/Services/show.service';
import { Show } from 'src/app/Models/Show';
import { OpenspaceService, SceneGraphNode } from 'src/app/Services/openspace.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { NotificationType } from 'src/app/Models/ToastNotification';
import { SceneForm } from 'src/app/Models/ShowForm';
import { GeoPosition } from 'src/app/Models/GeoPosition';
import { SceneOptions } from 'src/app/Models/SceneOptions';
import { SceneExecutorService } from 'src/app/Services/scene-executor.service';
import { CreatorMenuItem } from 'src/app/Models/CreatorMenuItem';
import { ScenePositionComponent } from './components/scene-position/scene-position.component';
import { BaseComponent } from 'src/app/Shared/base/base.component';
import { cloneDeep } from 'lodash';
import { SceneIssue } from 'src/app/Models/SceneIssue';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(ScenePositionComponent) scenePositionComponent!: ScenePositionComponent


  // #region observable sources
    readonly $setSceneIssues = new BehaviorSubject<SceneIssue[]>([])
    readonly $setScene = new BehaviorSubject<Scene | null>(null)
    readonly $setSaveDisabled = new BehaviorSubject<boolean>(false)
    readonly $setResetVisibility = new Subject<boolean>()
    readonly $setConfirmVisibility = new Subject<boolean>()
    readonly $setDuplicateVisibility = new Subject<boolean>()
    readonly $setExportVisibility = new Subject<boolean>()
    readonly $setManualVisibility = new Subject<boolean>()
    readonly $duplicateScene = new Subject<Scene | null>()
  // #endregion

  // #region observable subscribers
    readonly $selectedScene = this.$setScene
    .asObservable()
    .pipe(
      distinctUntilChanged(),
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
    readonly $isManualShowing = this.$setManualVisibility.asObservable()
    readonly $isExportShowing = this.$setExportVisibility.asObservable()
    readonly $isConfirmShowing = this.$setConfirmVisibility.asObservable()
    readonly $isResetShowing = this.$setResetVisibility.asObservable()
    readonly $isSaveDisabled = this.$setSaveDisabled.asObservable()
    readonly $isDuplicateShowing = this.$duplicateScene.asObservable()
    .pipe( map(s => {
      s = cloneDeep(s)

      if(!s){ return s }

      s!.title += ' (1)'

      return s
    }))

  // #endregion


  show!: Show
  menu!: CreatorMenuItem[]
  sceneIssues: SceneIssue[] = []
  
  isSaved: boolean = true
  isAutoMode:boolean = false
  
  query: string = ''
  exportedShowName: string = ''

  sceneForm = this.fb.group<SceneForm>({
    script: this.fb.control<string | null>(null),
    transistion: this.fb.control<number | null>(null, Validators.pattern(/^[0-9]*\.?[0-9]*$/)),
    
    title: this.fb.nonNullable.control<string>('New Scene', [Validators.required]),
    geoPos: this.fb.nonNullable.control<GeoPosition>({lat: 0, long: 0, alt: 0, node: SceneGraphNode.Earth, timestamp: '' }),
    options: this.fb.nonNullable.control<SceneOptions>({keepCameraPosition: true, enabledTrails: []})
  })
  
  
  readonly DEFAULT_SCENE = this.sceneForm.getRawValue()

  constructor(
    private route: ActivatedRoute, public showService: ShowService,
    private notiService: NotificationService, private fb: FormBuilder,
    private openSpaceService: OpenspaceService, private sceneExecutor: SceneExecutorService) {
      
    super()

    this.route.params
    .pipe(
      map(params => params?.['id']),
      map(id => showService.getShowById( parseInt(id))! ),
      first(),
    )
    .subscribe(show => {
      this.show = show
      this.$setSaveDisabled.next(!this.isShowValid())
    })
    
    
    this.sceneForm.valueChanges
    .pipe(
      takeUntil(this.$unsub),
      withLatestFrom(this.$selectedScene),
      filter( ([, selectedScene]) => !!selectedScene),
      map(([formVal, selectedScene]) => {
      
        return [
          {
            id: selectedScene!.id,
            title: formVal.title!,
            geoPos: formVal.geoPos!,
            options: formVal.options!,
            duration: formVal.transistion!,
            script: formVal.script!
          },
          selectedScene as Scene
        ]
      }),
      tap( ([, scene]) => {
        this.isSaved = false
        this.$setSaveDisabled.next(!this.isShowValid())

        const errors = this.sceneIssues.filter(issue => issue.scene.id !== scene.id)
        
        this.sceneIssues = this.isScenesValid() ? errors : [{scene, issues: this.getSceneIssues()}, ...errors] 

        this.$setSceneIssues.next(this.sceneIssues)
      })
    )
    .subscribe( ([updated,]) => { 
      let original = this.show.scenes.find(s => s.id === updated.id )!
      Object.assign(original, updated)
    })
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
            callBack: () => {
              this.exportedShowName = this.show.title
              this.$setExportVisibility.next(true)
            },
            isDisabled: this.$isSaveDisabled
          },
        ],
      },
      {
        name: 'Edit',
        subMenus: [
          {
            name: 'Duplicate Scene',
            hotKey: ['D'],
            callBack: () => {
              this.$selectedScene
              .pipe( first() )
              .subscribe( s => this.$duplicateScene.next(s))
            },
            isDisabled: this.$selectedScene
            .pipe(
              map( s => s == null),
              takeUntil(this.$unsub)
            )
          },
        ]
      },
      {
        name: 'Help',
        subMenus: [
          {
            name: 'Manual',
            hotKey: ['H'],
            isDisabled: false,
            callBack: () => this.$setManualVisibility.next(true)
          }
        ]
      }
    ]
  }

  get formValue(){
    return this.sceneForm.getRawValue()
  }

  saveShow(): void{

    if(!this.sceneForm.valid){ return }
    
    this.showService.save(this.show) 
    this.isSaved = true
    this.notiService.showNotification({title: 'Show Saved', type: NotificationType.SUCCESS})
   
    if(this.scenePositionComponent){
      this.scenePositionComponent.$isAutoMode.next(false)
    }
  }

  onDeleteClicked(){ 
    this.$setConfirmVisibility.next(true)
  }

  onResetClicked(): void{
    this.$setResetVisibility.next(true)
  }

  duplicateScene(scene: Scene){
    const { scenes } = this.show
    const duplicate: Scene = cloneDeep(scene)

    duplicate.id = scenes.reduce((id, s) => Math.max(id, s.id), 0) + 1

    scenes.push(duplicate)
    this.$duplicateScene.next(null)
    this.$setScene.next(duplicate)
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
    this.$setResetVisibility.next(false)
  }

  preview(scene: Scene): void{
  
    try{
      this.sceneExecutor.execute(scene)
    }
    catch{
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
    const fileTitle = this.exportedShowName + '.json'

    a.href = URL.createObjectURL(file)
    a.download = fileTitle
    a.click()

    URL.revokeObjectURL(a.href)

    this.notiService.showNotification({
      title: 'Show saved to ' + fileTitle,
      type: NotificationType.SUCCESS
    })

  }

  sceneTitleExists(title: string): boolean{
    return this.show.scenes.some(s => s.title.trim() === title.trim())
  }

  onTitleChange(title: string): void{
    this.$setSaveDisabled.next(!this.isShowValid())
  }

  private isScenesValid(): boolean{
    return Object.values(this.sceneForm.controls).every(ctrl => ctrl.valid)
  }

  private isShowValid(): boolean{
    return this.isScenesValid() && !!this.show.title.trim()
  }

  private getSceneIssues(): string[]{
    const ctrls = Object.values(this.sceneForm.controls)
    .filter(ctrl => ctrl.invalid)
    .map(ctrl => {
      const formGroup = ctrl.parent!.controls;
      return Object.keys(formGroup).find(name => ctrl === ctrl.parent?.get(name)) || null;
    })
    
    return ctrls as string[]
  }
}

