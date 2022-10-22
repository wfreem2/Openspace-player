import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Scene } from 'src/app/Interfaces/Scene';
import { merge } from "lodash"

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  detailsForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    desc: new FormControl(''),
  })

  
  currScene: Scene = 
  { 
    id: 1,
    title: '',
    geoPos: {
      lat: 0,
      long: 0,
      alt: 0
    }
  }
  
  scenes: Scene[] = []

  isAutoMode:boolean = true
  showMeta: boolean = true

  constructor() { }

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
    return  { 
      id: this.currScene.id+1,
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
