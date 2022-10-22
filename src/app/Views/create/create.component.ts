import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Scene } from 'src/app/Interfaces/Scene';
import { merge } from "lodash"
import { ActivatedRoute, Route } from '@angular/router';
import { filter, first, map, mergeMap, pluck } from 'rxjs';
import { ShowService } from 'src/app/Services/show.service';
import { Show } from 'src/app/Interfaces/Show';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {


  private id: number = 0

  detailsForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    desc: new FormControl(''),
  })

  
  currScene: Scene = this.defaultScene()
  
  show!: Show
  scenes: Scene[] = []

  isAutoMode:boolean = true
  showMeta: boolean = true

  constructor(private route: ActivatedRoute, public showService: ShowService) {

    this.route.params
    .pipe(
      pluck('id'),
      first(),
      map(id => parseInt(id)),
      map(id => {
        const show = showService.getShowById(id)

        return !!show ? show : showService.getBlankShow() 
      }),
      //If there is an id in the route params
      //If the show with the provided id does not exist
    )
    .subscribe(show => {
      this.show = show
      console.log(show)
    })
   }

  ngOnInit(): void { }

  title(){ return this.detailsForm.get('title') }
  desc(){ return this.detailsForm.get('desc') }

  setActive(el: HTMLDivElement, target: any){

    const isChecked = target.checked

    if(!isChecked){ el.classList.remove('active') }
    
    else{ el.classList.add('active') }


  }

  setTab(target: EventTarget | null){
    const e = <HTMLInputElement> target
    this.showMeta = !this.showMeta;
  }

  addScene(scene: Scene){

    let existingScene = this.scenes.find(s => s.id === scene.id)

    if(!existingScene){ this.scenes.push(scene) }
    merge(existingScene, scene)

    
    this.setDefaultState() 
  }

  private defaultScene(): Scene{
    this.id++
    return  { 
      id: this.id,
      title: '',
      geoPos: {
        lat: 0,
        long: 0,
        alt: 0
      }
    }
  }
  

  private setDefaultState(): void{
    this.currScene = this.defaultScene()
    this.isAutoMode = true
  }

  onDelete(scene: Scene){
    //If the user is editing the scene and deletes it, reset current scene
    if(this.currScene.id === scene.id){
      this.setDefaultState()
    }

    this.scenes = this.scenes.filter(s => s.id !== scene.id)
  }

  onEdit(scene: Scene){ 
    this.isAutoMode = false
    this.currScene = scene
  }

  toggleCollapse(el: HTMLDivElement){
    if(el.classList.contains('collapsed')){
      el.classList.remove('collapsed')
    }
    else{
      el.classList.add('collapsed')
    }
  }

}
