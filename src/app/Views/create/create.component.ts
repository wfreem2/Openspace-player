import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Scene } from 'src/app/Interfaces/Scene';
import { merge } from "lodash"
import { ActivatedRoute } from '@angular/router';
import { first, map, pluck, Subject, takeUntil } from 'rxjs';
import { ShowService } from 'src/app/Services/show.service';
import { Show } from 'src/app/Interfaces/Show';
import { toggleClass } from 'src/app/Utils/utils';
import { SelectedSceneService } from './selected-scene.service';
import { OpenspaceService } from 'src/app/Services/openspace.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {


  private id: number = 0
  private readonly saveInterval = 1000 * 60 * 2
  private $unSub = new Subject<any>()


  tabIdx = 0


  detailsForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    desc: new FormControl(''),
  })

  show!: Show
  currScene?: Scene

  isSaved: boolean = true
  isAutoMode:boolean = false
  showMeta: boolean = false

  transitionControl: FormControl = new FormControl('', Validators.pattern(/^[0-9]*$/))

  constructor(private route: ActivatedRoute, public showService: ShowService,
     private selectedSceneService: SelectedSceneService, private openSpaceService: OpenspaceService) {

    this.route.params
    .pipe(
      pluck('id'),
      map(id => {
        return (id === 'new') ? 
        showService.getBlankShow() :
        showService.getShowById(parseInt(id))!
      }),
      first()
    )
    .subscribe(show => {
      this.show = show

      //If at least on scene, set the id to highest id to avoid conflicting ids
      if(show.scenes.length){
        this.id = show.scenes.reduce( 
          (id, s) => Math.max(id, s.id), show.scenes[0].id
        )
      }
    })
    
    this.selectedSceneService.$selectedScene
    .pipe(takeUntil(this.$unSub))
    .subscribe(async s => {
      this.currScene = s
      await this.openSpaceService.getNavigationState()
    })


    /*     setInterval(() => {
      console.log('autosaving')
      this.showService.save(this.show)
    }, this.saveInterval) */
  }

  ngOnDestroy(): void { this.$unSub.next(undefined) }


  ngOnInit(): void { }

  title(){ return this.detailsForm.get('title') }
  desc(){ return this.detailsForm.get('desc') }

  onChange(): void{
    this.isSaved = false
  }

  saveShow(): void{
    this.showService.save(this.show); 
    this.isSaved=true
  }

  saveScene(){
    console.log(this.currScene)
    let existingScene = this.show.scenes.find(s => s.id === this.currScene!.id)
    if(!existingScene){ this.show.scenes.push(this.currScene!) }
    
    merge(existingScene, this.currScene)    
  }

  onDelete(scene: Scene){
    //If the user is editing the scene and deletes it, reset current scene
    if(this.currScene!.id === scene.id){ this.setDefaultState() }

    this.show.scenes = this.show.scenes.filter(s => s.id !== scene.id)
  }

  onEdit(scene: Scene){ 
    this.isAutoMode = false
    this.currScene = scene
  }

  setActive(el: HTMLDivElement, target: any){
    const isChecked = target.checked

    if(!isChecked){ el.classList.remove('active') }
    
    else{ el.classList.add('active') }
  }

  newScene(): void{
    this.selectedSceneService.setScene(this.defaultScene)
  }

  toggleClass(el: HTMLElement){ toggleClass(el, 'collapsed') }

  private get defaultScene(): Scene{
    this.id++
    return  { 
      id: this.id,
      title: '',
      sceneOptions: {
        keepCameraPosition: true,
        enabledTrails: []
      },
      geoPos: { lat: 0, long: 0, alt: 0 }
    }
  }

  private setDefaultState(): void{
    // this.currScene = this.defaultScene
    this.currScene = undefined
    this.isAutoMode = true
  }

}
