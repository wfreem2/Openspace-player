import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Scene } from 'src/app/Interfaces/Scene';
import { merge } from "lodash"
import { ActivatedRoute } from '@angular/router';
import { map, pluck, Subject } from 'rxjs';
import { ShowService } from 'src/app/Services/show.service';
import { Show } from 'src/app/Interfaces/Show';
import { toggleClass } from 'src/app/Utils/utils';
import { SelectedSceneService } from './selected-scene.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {


  private id: number = 0

  tabIdx = 0


  detailsForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    desc: new FormControl(''),
  })

  
  show!: Show
  currScene!: Scene

  isAutoMode:boolean = true
  showMeta: boolean = false


  events = new Subject<Scene>()

  constructor(private route: ActivatedRoute, public showService: ShowService,
     private selectedSceneService: SelectedSceneService) {

    this.route.params
    .pipe(
      pluck('id'),
      map(id => {
        return (id === 'new') ? 
        showService.getBlankShow() :
        showService.getShowById(parseInt(id))!
      })
    )
    .subscribe(show => {
      this.show = show

      //If at least on scene, set the id to be greater to avoid conflicting ids
      if(show.scenes.length){
        this.id = show.scenes.reduce( 
          (id, s) => Math.max(id, s.id), show.scenes[0].id
        )
      }
    })
    
    this.selectedSceneService.$selectedScene
    .subscribe(s => this.currScene = s)

  }

  ngOnInit(): void { }

  title(){ return this.detailsForm.get('title') }
  desc(){ return this.detailsForm.get('desc') }



  onSave(scene: Scene){

    let existingScene = this.show.scenes.find(s => s.id === scene.id)

    if(!existingScene){ this.show.scenes.push(scene) }
    
    merge(existingScene, scene)    
  }

  onDelete(scene: Scene){

    console.log(scene)
    //If the user is editing the scene and deletes it, reset current scene
    if(this.currScene.id === scene.id){ this.setDefaultState() }

    this.show.scenes = this.show.scenes.filter(s => s.id !== scene.id)
  }

  onEdit(scene: Scene){ 
    this.isAutoMode = false
    this.currScene = scene

    this.events.next(scene)
  }

  setActive(el: HTMLDivElement, target: any){
    const isChecked = target.checked

    if(!isChecked){ el.classList.remove('active') }
    
    else{ el.classList.add('active') }
  }

  setTab(target: EventTarget | null){
    const e = <HTMLInputElement> target
    this.showMeta = !this.showMeta;
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
      geoPos: {
        lat: 0,
        long: 0,
        alt: 0
      },
      travelMethod: 'flyTo'
    }
  }

  private setDefaultState(): void{
    this.currScene = this.defaultScene
    this.isAutoMode = true
  }

}
