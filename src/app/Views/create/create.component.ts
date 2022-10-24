import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Scene } from 'src/app/Interfaces/Scene';
import { merge } from "lodash"
import { ActivatedRoute, Route } from '@angular/router';
import { filter, first, map, mergeMap, pluck } from 'rxjs';
import { ShowService } from 'src/app/Services/show.service';
import { Show } from 'src/app/Interfaces/Show';
import { toggleClass } from 'src/app/Utils/utils';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {


  private id!: number

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

        //If the show with the provided id does not exist return a blank show
        return !!show ? show : showService.getBlankShow() 
      }),
    )
      .subscribe(show => {
        this.show = show
        //Set the id to the last show to not have conflicting ids
        this.id = show.scenes.length
      })
   }

  ngOnInit(): void { }

  title(){ return this.detailsForm.get('title') }
  desc(){ return this.detailsForm.get('desc') }



  addScene(scene: Scene){

    let existingScene = this.show.scenes.find(s => s.id === scene.id)

    if(!existingScene){ this.show.scenes.push(scene) }
    
    merge(existingScene, scene)
    
    this.setDefaultState() 
  }

  onDelete(scene: Scene){
    //If the user is editing the scene and deletes it, reset current scene
    if(this.currScene.id === scene.id){ this.setDefaultState() }

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

  setTab(target: EventTarget | null){
    const e = <HTMLInputElement> target
    this.showMeta = !this.showMeta;
  }

  toggleClass(el: HTMLElement){ toggleClass(el, 'collapsed') }

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

}
